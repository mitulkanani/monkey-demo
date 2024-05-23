/* eslint-disable import/no-extraneous-dependencies */

import React, { useEffect, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

import AddMonkeyModel from '../components/models/AddMonkeyModel';
import { Meta } from '../layouts/Meta';
import { MonkeyAPI } from '../services/monkey';
import { Main } from '../templates/Main';
import type { MonkeyDetail } from '../types/monkey';

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<MonkeyDetail[] | []>([]);
  const [metadata, setMetaData] = useState(null);

  const getallMonkey = () => {
    MonkeyAPI.getallMonkey(currentPage)
      .then((response) => {
        if (currentPage > 1) {
          setData([...new Set([...data, ...response?.data?.body])]);
        } else {
          setData(response?.data?.body);
        }
        setMetaData(response?.data?.meta?.pagination);
      })
      .catch(() => {})
      .finally(() => {});
  };

  useEffect(() => {
    getallMonkey();
  }, [currentPage]);

  return (
    <Main meta={<Meta title="Monkey - Home" description="" />}>
      <section className="body-font relative mx-auto mt-10 max-w-7xl rounded-lg border px-5 py-24 text-gray-600">
        <div className="container mx-auto flex flex-col items-center gap-4">
          <div className="ml-auto flex justify-end">
            <button
              type="button"
              className=" mx-3 inline-flex w-fit items-center rounded-lg bg-green-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-400/90 focus:outline-none focus:ring-4 focus:ring-green-400/50"
              onClick={() => setIsOpen(!isOpen)}
            >
              Add New
            </button>
          </div>
          {data && data.length === 0 && <div>No record found</div>}
          <div className="grid grid-cols-3">
            {data?.map((item: MonkeyDetail, index) => (
              <div key={index} className="relative p-4">
                <button
                  onClick={() => {
                    MonkeyAPI.DeleteMonkey(item.id).then((response) => {
                      if (
                        response &&
                        response.data &&
                        response.status === 200
                      ) {
                        toast.success('Record deleted successfully');
                        getallMonkey();
                      }
                    });
                  }}
                  className="absolute right-2 top-2 z-50 rounded-full bg-gray-300 p-2 text-red-600"
                >
                  <FaRegTrashAlt className="text-sm" />
                </button>

                <div className="h-full overflow-hidden rounded-lg border-2 border-gray-200 opacity-60">
                  <img
                    className="w-full object-cover object-center md:h-36 lg:h-64"
                    src={item.url ? item.url : 'https://dummyimage.com/720x400'}
                    alt="Image"
                  />

                  <div className="p-6">
                    <p className="mb-3 text-sm leading-relaxed">
                      {item?.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {data && data.length > 0 && currentPage !== metadata.totalPages && (
            <button
              type="button"
              className=" inline-flex w-fit items-center rounded-lg bg-[#24292F] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#24292F]/90 focus:outline-none focus:ring-4 focus:ring-[#24292F]/50 dark:hover:bg-[#050708]/30 dark:focus:ring-gray-500"
              onClick={() => {
                setCurrentPage(currentPage + 1);
              }}
            >
              Load More
            </button>
          )}
          {data &&
            data.length > 0 &&
            currentPage === metadata.totalPages &&
            currentPage !== 1 && (
              <button
                type="button"
                className=" inline-flex w-fit items-center rounded-lg bg-[#24292F] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#24292F]/90 focus:outline-none focus:ring-4 focus:ring-[#24292F]/50 dark:hover:bg-[#050708]/30 dark:focus:ring-gray-500"
                onClick={() => {
                  setCurrentPage(currentPage - 1);
                }}
              >
                Show less
              </button>
            )}
        </div>
      </section>
      {isOpen && (
        <AddMonkeyModel
          setOpen={setIsOpen}
          getData={getallMonkey}
          setCurrentPage={setCurrentPage}
        />
      )}
    </Main>
  );
};

export default Index;
