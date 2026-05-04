const Footer = () => {
  return (
    <footer className="bg-myTurquoise/40 text-center py-6">
      <p className="text-sm text-myGrey">
        &copy; {new Date().getFullYear()} Tajinder Nijjar. All rights reserved.
      </p>
      <p className="text-xs text-myGrey/60 mt-1">
        Game data provided by{" "}
        
        <a  href="https://rawg.io"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-myGrey transition-colors"
        >
          RAWG
        </a>
      </p>
    </footer>
  );
};

export default Footer;