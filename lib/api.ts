/*
Функції для виконання HTTP-запитів винесіть в окремий файл src/services/noteService.ts. Типізуйте їх параметри, результат, який вони повертають, та відповідь від Axios. У вас мають бути наступні функції:

fetchNotes : має виконувати запит для отримання колекції нотаток із сервера. 
Повинна підтримувати пагінацію (через параметр сторінки) та фільтрацію за 
ключовим словом (пошук);

createNote: має виконувати запит для створення нової нотатки на сервері. 
Приймає вміст нової нотатки та повертає створену нотатку у відповіді;

deleteNote: має виконувати запит для видалення нотатки за заданим 
ідентифікатором. Приймає ID нотатки та повертає інформацію про видалену 
нотатку у відповіді.

Типізація

Інтерфейси, які описують відповіді http-запитів (FetchNotesResponse і т.д.) 
та параметри функцій, які виконують http-запити у — 
src/services/noteService.ts.
 */

import axios from "axios";
import type { Note } from "../types/note";

interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

const instance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

const PER_PAGE = 12;

async function fetchNotes(
  query: string,
  page: number
): Promise<NotesHttpResponse> {
  const response = await instance.get<NotesHttpResponse>("/notes", {
    params: {
      search: query,
      page: page,
      perPage: PER_PAGE,
    },
  });
  return response.data;
}

async function createNote(
  title: string,
  content: string | null,
  tag: string
): Promise<Note> {
  const response = await instance.post<Note>("/notes", {
    title: title,
    content: content,
    tag: tag,
  });
  return response.data;
}

async function deleteNote(noteId: string): Promise<Note> {
  const response = await instance.delete<Note>(`/notes/${noteId}`);
  return response.data;
}

async function fetchNoteById(noteId: string): Promise<Note> {
  const response = await instance.get<Note>(`/notes/${noteId}`);
  return response.data;
}

export { fetchNotes, createNote, deleteNote, fetchNoteById };
