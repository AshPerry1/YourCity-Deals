import AddBusinessForm from '../components/AddBusinessForm';

export default function AddBusinessPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3">
            Add New Business
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Register a new merchant partner to offer coupons in your books.
          </p>
        </div>
      </div>

      {/* Form */}
      <AddBusinessForm />
    </div>
  );
}
