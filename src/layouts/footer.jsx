export default function Footer() {
  return (
    <footer className="bg-white shadow-inner p-4 text-center text-gray-600">
      © {new Date().getFullYear()} Mon Application. Tous droits réservés.
    </footer>
  );
}
