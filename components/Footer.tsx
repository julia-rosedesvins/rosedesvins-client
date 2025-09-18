export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <div className="mb-4 md:mb-0">
            <p>Copyright © {new Date().getFullYear()} Rose des Vins</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900">
              FAQ
            </a>
            <a href="#" className="hover:text-gray-900">
              Mentions légales
            </a>
            <a href="#" className="hover:text-gray-900">
              Politique de confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
