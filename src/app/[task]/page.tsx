"use client";

import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import update from "immutability-helper";
import Todo from "./components/Todo";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Input from "../shared/components/Input";

export type Task = {
  name: string;
  id: string;
  todos: Todo[];
};

export type Todo = {
  label: string;
  completed: boolean;
  id: string;
};

export default function TodoList() {
  const params = useParams<{ task: string }>();

  const [isInitialized, updateIsInitialized] = useState(false);
  const [todos, updateTodos] = useState<
    {
      label: string;
      completed: boolean;
      id: string;
    }[]
  >([]);

  const task = useMemo(() => {
    if (typeof window === "undefined") return { name: "" };
    const tasks = JSON.parse(localStorage.getItem("data") ?? "[]") as Task[];
    return tasks.find((el: Task) => el.id === params.task) ?? { name: "" };
  }, [params.task]);

  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem("data") ?? "[]") as Task[];
    const task = tasks.find((el: Task) => el.id === params.task);

    if (!task) return;

    updateTodos(task?.todos ?? []);
    updateIsInitialized(true);
  }, [params.task]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("data") ?? "[]") as Task[];
    const task = data.find((el: Task) => el.id === params.task);

    if (!task || !isInitialized) return;

    task.todos = todos;
    localStorage.setItem("data", JSON.stringify(data));
  }, [todos, isInitialized, params.task]);

  function handleClick(state: boolean, id: string) {
    const currentTodos = [...todos];
    const todo = currentTodos.find((el) => el.id === id);

    if (!todo) return;

    todo.completed = state;
    updateTodos(currentTodos);
  }

  function handleDelete(state: boolean, id: string) {
    if (!state && !confirm("This todo is not completed yet. are you sure??"))
      return;

    const currentTodos = [...todos];
    const index = currentTodos.findIndex((el) => el.id === id);
    if (index === -1) return;

    currentTodos.splice(index, 1);
    updateTodos(currentTodos);
  }

  function handleEdit(id: string) {
    const currentTodos = [...todos];
    const todo = currentTodos.find((el) => el.id === id);
    if (!todo) return;

    const label = prompt("Update todo: ", todo.label);
    if (!label) return;

    todo.label = label;

    updateTodos(currentTodos);
  }

  function handleAddTodo(label: string) {
    const currentTodos = [...todos];
    currentTodos.push({ label, completed: false, id: uuidv4() });
    updateTodos(currentTodos);
  }

  function handleClear() {
    const currentTodos = [...todos];
    const confirmation = confirm("Are you sure??");
    if (!confirmation) return;
    updateTodos(currentTodos.filter((el) => !el.completed));
  }

  const findCard = useCallback(
    (id: string) => {
      const card = todos.filter((c) => `${c.id}` === id)[0];
      return {
        card,
        index: todos.indexOf(card),
      };
    },
    [todos],
  );

  const moveCard = useCallback(
    (id: string, atIndex: number) => {
      const { card, index } = findCard(id);
      updateTodos(
        update(todos, {
          $splice: [
            [index, 1],
            [atIndex, 0, card],
          ],
        }),
      );
    },
    [findCard, todos, updateTodos],
  );

  const todosList = todos.map((el, i) => {
    return (
      <div
        key={el.id}
        className={
          i !== todos.length - 1 ? "border-b border-slate-500 p-2" : "p-2"
        }
      >
        <Todo
          todo={el}
          index={i}
          onClick={handleClick}
          onDelete={handleDelete}
          onEdit={handleEdit}
          moveCard={moveCard}
        />
      </div>
    );
  });

  const loadingTemplate = (
    <div className="h-full w-full text-white flex flex-col items-center justify-center">
      <svg
        className="h-6 w-6 animate-spin-slow duration-1000 text-white"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        fill="currentColor"
      >
        <path
          opacity=".4"
          d="M65.6 414.4c0 8.2 3.1 16.4 9.4 22.6c12.5 12.5 32.8 12.5 45.3 0l45.3-45.3c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L75 391.8c-6.2 6.2-9.4 14.4-9.4 22.6zM224 416l0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32zM346.5 120.2c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L437 120.2c12.5-12.5 12.5-32.8 0-45.3c-6.2-6.2-14.4-9.4-22.6-9.4s-16.4 3.1-22.6 9.4l-45.3 45.3zm0 226.3c-12.5 12.5-12.5 32.8 0 45.3L391.8 437c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-45.3-45.3c-12.5-12.5-32.8-12.5-45.3 0zM384 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32z"
        />
        <path d="M256 0c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64c0-17.7-14.3-32-32-32zM0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32zM120.2 75C107.7 62.5 87.5 62.5 75 75s-12.5 32.8 0 45.3l45.3 45.3c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L120.2 75z" />
      </svg>
    </div>
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-dvh w-full bg-slate-900 text-white flex flex-col items-center">
        <div className="flex h-full flex-col gap-3 w-[28rem] items-start max-h-full py-5 pl-5 pr-3">
          <div className="w-full pr-2">
            <Input placeholder="Add todo" onSubmit={handleAddTodo} />
          </div>
          <div className="h-2"></div>
          <span className="mb-2 text-lg font-semibold text-white">
            Todos {task.name && `(${task.name})`}:
          </span>
          <ul className="max-w-md list-inside text-gray-400 h-full overflow-auto w-full pr-1">
            {!isInitialized
              ? loadingTemplate
              : todos.length
                ? todosList
                : "No todos in the list!!"}
          </ul>

          {Boolean(todos.filter((el) => el.completed).length) && (
            <a
              className="font-medium text-blue-500 hover:underline cursor-pointer"
              onClick={handleClear}
            >
              Clear completed?
            </a>
          )}
        </div>
      </div>
    </DndProvider>
  );
}
