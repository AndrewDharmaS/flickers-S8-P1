import Link from "next/link";
import Logo from "../parts/logo";
const Navbar = () => {
  return (
    <>
      <section className="navbar">
        <div className="page-limit">
          <div className="logo-wrapper">
            <Link href="/">
              <div className="nav">
                <Logo fontSize="2rem" />
              </div>
            </Link>
          </div>
          <div className="nav-wrapper filler">
            <div className="filler-animation"></div>
          </div>
          <div className="nav-wrapper">
            <Link href="/movies">
              <div className="nav">Movies</div>
            </Link>
          </div>
          <div className="nav-wrapper">
            <Link href="/persons">
              <div className="nav">Persons</div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
export default Navbar;
