interface FormPostProps extends FormData {}

const FormPost: React.FC<FormPostProps> = ({
  title,
  description,
  imageUrl,
  formUrl,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg cursor-pointer">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-gray-700">{description}</p>
        <a
          href={formUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="text-blue-500 hover:underline"
        >
          Fill out the Form
        </a>
      </div>
    </div>
  );
};

export default FormPost;
