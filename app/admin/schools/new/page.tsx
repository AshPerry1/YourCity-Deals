import AddSchoolForm from '../components/AddSchoolForm';

export default function AddSchoolPage() {
  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3">
            Add New School
          </h1>
          <p className="text-lg text-gray-600">
            Register a new educational institution in your system
          </p>
        </div>
      </div>

      {/* Add School Form */}
      <AddSchoolForm />
    </div>
  );
}
