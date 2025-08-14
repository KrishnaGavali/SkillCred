from github import Github
from github.Repository import Repository
from github.ContentFile import ContentFile
from typing import Dict, Union, TypedDict


class FileStructure(TypedDict, total=False):
    # A file maps to its path (str), and a folder maps to a nested structure
    # So keys are file/folder names, values are either str or nested dict
    # We use recursive typing below
    ...


FolderStructure = Dict[str, Union[str, "FolderStructure"]]


def get_github_client(token: str) -> Github:

    return Github(token)


def get_folder_structure(repo: Repository, path: str = "") -> FolderStructure:
    """Recursively get the folder structure of a GitHub repository."""
    contents = repo.get_contents(path)
    if isinstance(contents, ContentFile):
        contents = [contents]
    structure: FolderStructure = {}
    for content in contents:
        if content.type == "dir":
            structure[content.name] = get_folder_structure(repo, content.path)
        else:
            structure[content.name] = content.path
    return structure


def get_file_content(repo: Repository, file_path: str) -> str:
    """Get the content of a file in the repository."""
    file_content = repo.get_contents(file_path)
    if isinstance(file_content, ContentFile):
        return file_content.decoded_content.decode("utf-8")
    raise ValueError(f"Path {file_path} does not point to a file.")


# # Step 1: Create a GitHub client
# client = get_github_client("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")

# # Step 2: Get the repo using full name
# repo = client.get_repo("KrishnaGavali/TypeStrike")

# # Step 3: Get Readme file content
# readme_content = get_file_content(repo, "README.md")
# print("Readme Content:\n", readme_content)
