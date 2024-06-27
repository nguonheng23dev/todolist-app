// import { NextApiRequest, NextApiResponse } from 'next';
// import { Todo } from '../../types';
// import { v4 as uuidv4 } from 'uuid';

// let todos: Todo[] = [
//   {
//     id: uuidv4(),
//     todo: "Sample Todo 1",
//     isCompleted: false,
//     createdAt: new Date().toISOString(),
//   },
//   {
//     id: uuidv4(),
//     todo: "Sample Todo 2",
//     isCompleted: false,
//     createdAt: new Date().toISOString(),
//   },
// ];

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { method } = req;
//   switch (method) {
//     case 'GET':
//       res.status(200).json(todos);
//       break;
//     case 'POST':
//       const newTodo: Todo = req.body;
//       todos.push(newTodo);
//       res.status(201).json({ success: true });
//       break;
//     case 'PUT':
//       const { id } = req.query;
//       const updatedTodo: Todo = req.body;
//       todos = todos.map(todo => todo.id === id ? updatedTodo : todo);
//       res.status(200).json({ success: true });
//       break;
//     case 'DELETE':
//       const deleteId = req.query.id as string;
//       todos = todos.filter(todo => todo.id !== deleteId);
//       res.status(200).json({ success: true });
//       break;
//     default:
//       res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
//       res.status(405).end(`Method ${method} Not Allowed`);
//   }
// }


import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';
import { Todo } from '../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { data, error } = await supabase
          .from('todos')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;

        res.status(200).json(data);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'POST':
      try {
        const { todo } = req.body;
        const { data, error } = await supabase
          .from('todos')
          .insert([{ todo, is_completed: false }])
          .single();

        if (error) throw error;

        res.status(201).json(data);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'PUT':
      try {
        const { id } = req.query;
        const updatedTodo: Todo = req.body;
        const { data, error } = await supabase
          .from('todos')
          .update(updatedTodo)
          .eq('id', id as string);

        if (error) throw error;

        res.status(200).json(data);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        const { data, error } = await supabase
          .from('todos')
          .delete()
          .eq('id', id as string);

        if (error) throw error;

        res.status(200).json(data);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
