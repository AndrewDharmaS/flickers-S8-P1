import Link from "next/link";
import Logo from "../parts/logo";
import ArrowCircleUpRoundedIcon from "@mui/icons-material/ArrowCircleUpRounded";

const returnToTopHandleClick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const Footer = () => {
  return (
    <>
      <section className="footer">
        <div className="page-limit">
          <div className="footer-wrapper">
            <Logo fontSize="4rem" />
            <div className="sentence">
              The only place where you can satisfy your carve for knowledge in
              the movies universe.
            </div>
            <div className="copyright">&copy; 2023 Flickers</div>
            <div className="return-top">
              <ArrowCircleUpRoundedIcon
                onClick={returnToTopHandleClick}
                aria-label="Back to Top"
                fontSize="inherit"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Footer;
