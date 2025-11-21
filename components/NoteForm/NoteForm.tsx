import { useId } from "react";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import { createNote } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface NoteFormProps {
  onClose: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: string;
}

const initialValues: NoteFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title too short")
    .max(50, "Title too long")
    .required("Title is required"),
  content: Yup.string().max(500, "Message too long"),
  tag: Yup.string()
    .matches(/(Work|Personal|Meeting|Shopping|Todo)/)
    .required("Tag is required"),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();

  const { mutate: createNoteM } = useMutation({
    mutationFn: (values: {
      title: string;
      content: string | null;
      tag: string;
    }) => createNote(values.title, values.content, values.tag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
  });

  const handleSubmit = (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>
  ) => {
    createNoteM(values);
    actions.resetForm();
  };

  const handleReset = () => {
    onClose();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      <Form className={css.form}>
        <label htmlFor={`${fieldId}-title`}>Title</label>
        <Field
          type="text"
          name="title"
          id={`${fieldId}-title`}
          className={css.input}
        />
        <ErrorMessage name="title" component="span" className={css.error} />

        <label htmlFor={`${fieldId}-content`}>Content</label>
        <Field
          as="textarea"
          name="content"
          id={`${fieldId}-content`}
          className={css.textarea}
        />
        <ErrorMessage name="content" component="span" className={css.error} />

        <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <Field
          as="select"
          name="tag"
          id={`${fieldId}-tag`}
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </Field>
        <ErrorMessage name="tag" component="span" className={css.error} />

        <button type="reset" className={css.cancelButton}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton}>
          Create note
        </button>
      </Form>
    </Formik>
  );
}
