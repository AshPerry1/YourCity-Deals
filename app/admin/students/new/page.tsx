import AddStudentForm from '../components/AddStudentForm';

export default function AddStudentPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3">
            Add New Student
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Register a new student seller and generate their unique referral code.
          </p>
        </div>
      </div>

      {/* Form */}
      <AddStudentForm />
    </div>
  );
}
