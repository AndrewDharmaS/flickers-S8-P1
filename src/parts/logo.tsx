interface LogoProps {
  fontSize: string;
}
const Logo = ({ fontSize = "2rem" }: LogoProps) => {
  return (
    <>
      <div
        style={{
          fontSize: fontSize,
          fontWeight: "700",
        }}
      >
        <span
          style={{
            color: "rgb(var(--white))",
          }}
        >
          FLICK
        </span>
        <span
          style={{
            color: "rgb(var(--primary-theme))",
          }}
        >
          ERS
        </span>
      </div>
    </>
  );
};
export default Logo;
