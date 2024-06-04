"use client";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
// import "./app.css";
import { Authenticator } from "@aws-amplify/ui-react";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [task, setTask] = useState<string>("");
  console.log(task);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo(task: string) {
    client.models.Todo.create({
      content: task,
    });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  function handleOnChange() {
    createTodo(task);
  }

  return (
    <>
      <Authenticator>
        {({ signOut, user }) => (
          <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="font-bold text-3xl text-gray-800 mb-6">
              Tareas de {user?.signInDetails?.loginId}
            </h1>
            <input
              type="text"
              placeholder="Nueva tarea"
              className="transition duration-300 ease-in-out border border-gray-300 p-2 rounded-lg w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setTask(e.target.value)}
            />
            <button
              className="transition duration-300 ease-in-out bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded my-2"
              onClick={handleOnChange}
            >
              Agregar tarea
            </button>
            <ul className="w-full max-w-xs text-gray-700">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex justify-between items-center p-2 border-b border-gray-300 last:border-b-0 transition duration-300 ease-in-out hover:bg-gray-200"
                >
                  {todo.content}
                  <button
                    className="transition duration-300 ease-in-out bg-red-400 hover:bg-red-500 text-white font-bold py-1 px-2 rounded"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="transition duration-300 ease-in-out mt-4 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
              onClick={signOut}
            >
              Cerrar sesión
            </button>
          </main>
        )}
      </Authenticator>
    </>
  );
}
