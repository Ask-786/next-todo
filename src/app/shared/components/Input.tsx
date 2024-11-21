import { FormEvent, useRef } from "react";

interface Props {
  onSubmit: (value: string) => void;
}

export default function Input({ onSubmit }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmission(event: FormEvent) {
    event.preventDefault();
    if (!inputRef.current?.value) return;
    onSubmit(inputRef.current.value);
    inputRef.current.value = "";
  }

  return (
    <form onSubmit={handleSubmission} className="mx-auto w-full">
      <label className="mb-2 text-sm font-medium sr-only text-white">
        Enter Todo
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id="default-search"
          className="block w-full p-4 text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
          placeholder="Enter todo"
          required
        />
        <button
          type="submit"
          className="text-white absolute end-2.5 bottom-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
