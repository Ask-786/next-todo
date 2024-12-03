import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Todo as TTodo } from "../page";

interface Props {
  todo: TTodo;
  index: number;
  onClick: (state: boolean, id: string) => void;
  onDelete: (state: boolean, id: string) => void;
  onEdit: (id: string) => void;
  moveCard: (id: string, to: number) => void;
}

export default function Todo({
  todo,
  index,
  onClick,
  onDelete,
  onEdit,
  moveCard,
}: Props) {
  const itemRef = useRef<HTMLLIElement | null>(null);
  const [isControlShown, updateShowControl] = useState(false);
  const [dragging, drag] = useDrag(
    () => ({
      type: "card",
      item: { id: todo.id, originalIndex: index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();

        if (!didDrop) {
          moveCard(droppedId, originalIndex);
        }
      },
    }),
    [todo.id, index, moveCard],
  );

  const [, drop] = useDrop(
    () => ({
      accept: "card",
      hover({ id: draggedId }: { id: string }) {
        if (draggedId !== todo.id) {
          moveCard(draggedId, index);
        }
      },
    }),
    [index, moveCard],
  );

  function handleOnDelete() {
    onDelete(todo.completed, todo.id);
  }

  function handleOnEdit() {
    onEdit(todo.id);
  }

  function handleOnClicked() {
    onClick(!todo.completed, todo.id);
  }

  function handleMouseEnter() {
    updateShowControl(true);
  }

  function handleMouseLeave() {
    updateShowControl(false);
  }

  return (
    <li
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={itemRef}
      className="flex justify-between items-center gap-2 select-none"
      title={todo.label}
    >
      <div
        className={`flex items-center cursor-pointer w-full ${isControlShown ? "max-w-[81%]" : ""} ${dragging.isDragging ? "opacity-15" : ""}`}
        onClick={handleOnClicked}
      >
        <svg
          className={`w-3.5 h-3.5 me-2 ${todo.completed ? "text-green-400" : "text-gray-400"} flex-shrink-0`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
        </svg>
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">
          {todo.label}
        </span>
      </div>
      {isControlShown && (
        <div className="flex gap-1">
          <div
            onClick={handleOnEdit}
            title="Edit Todo"
            className="p-0.5 flex items-center justify-center cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5 text-gray-400 hover:text-orange-400 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 512 512"
            >
              <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
            </svg>
          </div>

          <div
            onClick={handleOnDelete}
            title="Delete Todo"
            className="p-0.5 flex items-center justify-center cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5 text-gray-400 hover:text-red-400 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 448 512"
            >
              <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
            </svg>
          </div>

          <div
            onClick={handleOnDelete}
            title="Delete Todo"
            className="p-0.5 flex items-center justify-center cursor-move"
            ref={() => {
              drag(drop(itemRef));
            }}
          >
            <svg
              className="w-3.5 h-3.5 text-gray-400 hover:text-blue-400 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 448 512"
            >
              <path d="M0 72C0 49.9 17.9 32 40 32H88c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H40c-22.1 0-40-17.9-40-40V72zM0 232c0-22.1 17.9-40 40-40H88c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H40c-22.1 0-40-17.9-40-40V232zM128 392v48c0 22.1-17.9 40-40 40H40c-22.1 0-40-17.9-40-40V392c0-22.1 17.9-40 40-40H88c22.1 0 40 17.9 40 40zM160 72c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H200c-22.1 0-40-17.9-40-40V72zM288 232v48c0 22.1-17.9 40-40 40H200c-22.1 0-40-17.9-40-40V232c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40zM160 392c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H200c-22.1 0-40-17.9-40-40V392zM448 72v48c0 22.1-17.9 40-40 40H360c-22.1 0-40-17.9-40-40V72c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40zM320 232c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H360c-22.1 0-40-17.9-40-40V232zM448 392v48c0 22.1-17.9 40-40 40H360c-22.1 0-40-17.9-40-40V392c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40z" />
            </svg>
          </div>
        </div>
      )}
    </li>
  );
}
