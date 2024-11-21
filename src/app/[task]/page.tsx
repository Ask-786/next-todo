"use client";

import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import React, { useCallback, useEffect, useState } from "react";
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

  const [todos, updateTodos] = useState<
    {
      label: string;
      completed: boolean;
      id: string;
    }[]
  >([]);

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

  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem("data") ?? "[]") as Task[];
    const task = tasks.find((el: Task) => el.name === params.task);
    updateTodos(task?.todos ?? []);
  }, [params.task]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("data") ?? "[]") as Task[];
    const task = data.find((el: Task) => el.name === params.task);
    if (task) {
      task.todos = todos;
    } else {
      data.push({ name: params.task, todos, id: uuidv4() });
    }
    localStorage.setItem("data", JSON.stringify(data));
  }, [params.task, todos]);

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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-[100vh] w-full bg-slate-900 text-white flex flex-col items-center">
        <div className="flex flex-col gap-3 w-[28rem] items-start max-h-full py-5 pl-5 pr-3">
          <div className="w-full pr-2">
            <Input onSubmit={handleAddTodo} />
          </div>
          <div className="h-2"></div>
          <span className="mb-2 text-lg font-semibold text-white">Todos:</span>
          <ul className="max-w-md list-inside text-gray-400 h-full overflow-auto w-full pr-1">
            {todos.length ? todosList : "No todos in the list!!"}
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
