import { useFormik } from 'formik';
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { MonkeyAPI } from '../../services/monkey';
import type { MonkeyDetail } from '../../types/monkey';

const AddMonkeyModel = ({
  setOpen,
  getData,
  setCurrentPage,
}: {
  open?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getData: () => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
    isSubmitting,
    setSubmitting,
  } = useFormik({
    initialValues: {
      description: '',
      url: '',
    },

    validationSchema: Yup.object({
      description: Yup.string()
        .required('Description is required')
        .matches(
          /^.{3,2000}$/,
          'Description should be more then 3 character and less then 2000 character'
        ),
      url: Yup.string()
        .required('URL is required')
        .matches(
          /^.{3,500}$/,
          'URL should be more then 3 character and less then 500 character'
        ),
    }),

    onSubmit: (value) => {
      setSubmitting(true);

      const data: MonkeyDetail = {
        description: value.description,
        url: value.url,
        id: 0,
      };
      MonkeyAPI.AddMonkey(data)
        .then((response) => {
          if (response && response.status === 200) {
            setOpen(false);
            toast.success('Record created successfully');
            setCurrentPage(1);
            getData();
          }
        })
        .catch(() => {})
        .finally(() => {});
    },
  });

  return (
    <>
      <div className="fixed left-0 top-0 z-[1000000] flex h-screen w-full items-center justify-center bg-black/30">
        <div className="relative w-[500px] rounded-md bg-white p-4">
          <button className="absolute right-2 top-2 z-50 rounded-full bg-gray-100 p-2 text-black">
            <IoMdClose className="text-sm" />
          </button>
          <form onSubmit={handleSubmit}>
            <h3 className="mb-6 text-center text-lg font-bold">Monkey</h3>
            <div>
              <div className="mb-4 flex flex-col">
                <label
                  className="text-sm font-semibold text-gray-900"
                  htmlFor="url"
                >
                  Image URL *
                </label>

                <input
                  id="url"
                  name="url"
                  type="text"
                  placeholder="Image URL"
                  value={values.url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="rounded-md border border-gray-400 bg-white p-2 text-sm shadow-sm focus:outline-none"
                />

                {errors.url && touched.url && (
                  <p className="mt-1 text-sm text-red-500">{errors.url}</p>
                )}
              </div>
              <div className="mb-4 flex flex-col">
                <label
                  className="text-sm font-semibold text-gray-900"
                  htmlFor="description"
                >
                  Description *
                </label>

                <textarea
                  id="description"
                  name="description"
                  placeholder="Description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                  className="rounded-md border border-gray-400 bg-white p-2 text-sm shadow-sm focus:outline-none"
                />
                {errors.description && touched.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
            <div className="modal-action flex items-center justify-end gap-2">
              <button
                className="mb-2 me-2 rounded-lg bg-red-700 px-5 py-1.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="mb-2 me-2 rounded-lg bg-green-700 px-5 py-1.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                disabled={isSubmitting}
              >
                <span>Save</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddMonkeyModel;
