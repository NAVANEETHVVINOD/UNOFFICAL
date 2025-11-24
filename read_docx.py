import zipfile
import re
import os

def read_docx(path):
    if not os.path.exists(path):
        return f"File not found: {path}"
    try:
        with zipfile.ZipFile(path) as z:
            xml_content = z.read('word/document.xml').decode('utf-8')
            text = re.sub('<[^>]+>', ' ', xml_content)
            text = ' '.join(text.split())
            return text
    except Exception as e:
        return f"Error reading {path}: {str(e)}"

with open('docx_content.txt', 'w', encoding='utf-8') as f:
    f.write("FLOW_CONTENT_START\n")
    f.write(read_docx(r'f:\kannan\projects\unoffical\linker flow.docx'))
    f.write("\nFLOW_CONTENT_END\n\n")

    f.write("PLAN_CONTENT_START\n")
    f.write(read_docx(r'f:\kannan\projects\unoffical\linker plan.docx'))
    f.write("\nPLAN_CONTENT_END\n")
