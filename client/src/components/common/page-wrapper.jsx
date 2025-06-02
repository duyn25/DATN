import { Helmet } from "react-helmet";

function PageWrapper({ title, children }) {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        
      </Helmet>
      {children}
    </>
  );
}

export default PageWrapper;
