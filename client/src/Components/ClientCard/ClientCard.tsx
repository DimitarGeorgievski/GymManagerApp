import { ChevronRight } from "lucide-react";

interface ClientCardProps {
  client: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  onClick?: () => void;
}

export function ClientCard({ client, onClick }: ClientCardProps) {
  return (
    <div
      key={client.id}
      className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-linear-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
            <span className="text-lg font-bold text-white">
              {client.firstName[0]}{client.lastName[0]}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {client.firstName} {client.lastName}
            </h3>
            <p className="text-sm text-gray-500">{client.email}</p>
          </div>
        </div>
        <ChevronRight className="text-gray-400" size={20} />
      </div>
    </div>
  );
}