import React from "react";
import Layout from "../layout/layout";
import FormPost  from "./FormPost";
import { FormDataItem } from "./FormData";

const FormsPage = () => {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Available Forms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FormData.map((FormData: { id: any }) => (
          <FormPost key={FormData.id} {...FormData} /> // Pass form data as props
        ))}
      </div>
    </Layout>
  );
};

export default FormsPage;
