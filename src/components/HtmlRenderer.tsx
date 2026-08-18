/***************************  CONTENT - INNER HTML  ***************************/

function HtmlRenderer({ htmlString }: { htmlString: string }) {
  return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
}

export default HtmlRenderer;
