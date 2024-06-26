import { NextApiRequest, NextApiResponse } from 'next';
import { Todo } from '../../types';
import { v4 as uuidv4 } from 'uuid';

let todos: Todo[] = [
  {
    id: uuidv4(),
    todo: "Sample Todo 1",
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    todo: "Sample Todo 2",
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
    case 'GET':
      res.status(200).json(todos);
      break;
    case 'POST':
      const newTodo: Todo = req.body;
      todos.push(newTodo);
      res.status(201).json({ success: true });
      break;
    case 'PUT':
      const { id } = req.query;
      const updatedTodo: Todo = req.body;
      todos = todos.map(todo => todo.id === id ? updatedTodo : todo);
      res.status(200).json({ success: true });
      break;
    case 'DELETE':
      const deleteId = req.query.id as string;
      todos = todos.filter(todo => todo.id !== deleteId);
      res.status(200).json({ success: true });
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
