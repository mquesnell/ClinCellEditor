import { ICellEditor, ICellEditorParams } from "ag-grid-community";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";

const KEY_BACKSPACE = 8;
const KEY_DELETE = 46;
const KEY_F2 = 113;
const KEY_ENTER = 13;
const KEY_TAB = 9;
const KEY_ESC = 27;

export const ClinCellEditor = forwardRef<ICellEditor, ICellEditorParams>(
  (props, ref) => {
    const createInitialState = () => {
      let startValue;
      let highlightAllOnFocus = true;

      if (props.keyPress === KEY_BACKSPACE || props.keyPress === KEY_DELETE) {
        // if backspace or delete pressed, we clear the cell
        startValue = "";
      } else if (props.charPress) {
        // if a letter was pressed, we start with the letter
        startValue = props.charPress;
        highlightAllOnFocus = false;
      } else {
        // otherwise we start with the current value
        startValue = props.value;
        if (props.keyPress === KEY_F2) {
          highlightAllOnFocus = false;
        }
      }

      return {
        value: startValue,
        highlightAllOnFocus
      };
    };

    const initialState = createInitialState();
    const [value, setValue] = useState<string>(initialState.value);
    const [highlightAllOnFocus, setHighlightAllOnFocus] = useState<boolean>(
      initialState.highlightAllOnFocus
    );

    const refInput = useRef<HTMLInputElement>(null);

    const isLeftOrRight = (event: React.KeyboardEvent<HTMLInputElement>) => {
      return [37, 39].indexOf(event.keyCode) > -1;
    };

    const getCharCodeFromEvent = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      event = event || window.event;
      return typeof event.which === "undefined" ? event.keyCode : event.which;
    };

    const isCharNumeric = (charStr: string) => {
      return !!/\d/.test(charStr);
    };

    const isKeyPressedNumeric = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      const charCode = getCharCodeFromEvent(event);
      const charStr = event.key ? event.key : String.fromCharCode(charCode);
      return isCharNumeric(charStr);
    };

    const deleteOrBackspace = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      const charCode = getCharCodeFromEvent(event);
      return charCode === KEY_DELETE || charCode === KEY_BACKSPACE;
    };

    const finishedEditingPressed = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      const charCode = getCharCodeFromEvent(event);
      return (
        charCode === KEY_ENTER || charCode === KEY_TAB || charCode === KEY_ESC
      );
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (isLeftOrRight(event) || deleteOrBackspace(event)) {
        event.stopPropagation();
        return;
      }

      if (!finishedEditingPressed(event) && !isKeyPressedNumeric(event)) {
        if (event.preventDefault) event.preventDefault();
      }
    };

    useEffect(() => {
      // focus on the input
      setTimeout(() => {
        if (refInput && refInput.current) {
          refInput.current.focus();
        }
      });
    }, []);

    /* Component Editor Lifecycle methods */
    useImperativeHandle(ref, () => {
      return {
        afterGuiAttached() {
          // get ref from React component
          const eInput = refInput.current;
          if (eInput) {
            eInput.focus();
            if (highlightAllOnFocus) {
              eInput.select();

              setHighlightAllOnFocus(false);
            } else {
              // when we started editing, we want the caret at the end, not the start.
              // comes into play in two scenarios: a) when user hits F2 and b)
              // when user hits a printable character, then on IE (and only IE) the caret
              // was placed after the first character, thus 'apply' would end up as 'pplea'
              const length = eInput.value ? eInput.value.length : 0;
              if (length > 0) {
                eInput.setSelectionRange(length, length);
              }
            }
          }
        },
        // the final value to send to the grid, on completion of editing
        getValue() {
          return value;
        },

        // Gets called once before editing starts, to give editor a chance to
        // cancel the editing before it even starts.
        isCancelBeforeStart() {
          if (props.charPress && "1234567890".indexOf(props.charPress) < 0) {
            return true;
          }
          return false;
        },

        // Gets called once when editing is finished (eg if Enter is pressed).
        // If you return true, then the result of the edit will be ignored.
        isCancelAfterEnd() {
          return false;
        }
      };
    });

    return (
      <input
        type="text"
        ref={refInput}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        style={{ width: "100%" }}
        maxLength={4}
        onKeyDown={(event) => onKeyDown(event)}
        name="ClinCellEditor"
      />
    );
  }
);
