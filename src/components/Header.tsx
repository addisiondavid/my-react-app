function Header() {
  return (
    <header className="flex items-center justify-between px-10">
      <div className="">
        <img
          src="/src/assets/logo.svg"
          alt="Weather App Logo"
          className="h-12 mx-auto my-4"
        />
      </div>

      <button className="flex items-center space-x-2 bg-[#1a1f35] text-gray-300 px-4 py-2 rounded-lg hover:bg-[#252b45] transition">
        <img src="/src/assets/icon-units.svg" alt="" />
        <span>Units</span>
        <img src="/src/assets/icon-dropdown.svg" alt="" />
      </button>
    </header>
  );
}

export default Header;
