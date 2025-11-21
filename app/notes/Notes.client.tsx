/**
 * Реалізуйте сторінковий компонент Notes у маршруті /notes як SSR-компонент,
 * де заздалегідь виконується prefetch (попереднє завантаження даних через
 * TanStack Query) з гідратацією кешу. Усю клієнтську логіку (отримання списку
 * нотаток за допомогою useQuery та їх відображення) винесіть в окремий файл
 * компонента app/notes/Notes.client.tsx.
 */

"use client";

import { useEffect, useState } from "react";
import { fetchNotes } from "@/lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
// import { Toaster } from "react-hot-toast";

import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

import css from "./NotesPage.module.css";

function NotesClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  const { data } = useQuery({
    queryKey: ["notes", searchQuery, currentPage],
    queryFn: () => fetchNotes(searchQuery, currentPage),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 0;

  const handleSearch = async (newQuery: string) => {
    setSearchQuery(newQuery);
    setCurrentPage(1);
  };

  const onSearchQueryChange = useDebouncedCallback(
    (query: string) => handleSearch(query),
    300
  );

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={onSearchQueryChange} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageClick={setCurrentPage}
          />
        )}
        {
          <button className={css.button} onClick={openModal}>
            Create note +
          </button>
        }
      </header>
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}

export default NotesClient;
