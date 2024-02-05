import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { ProgressSpinner } from "primereact/progressspinner";

const Main = () => {
  const [project, setProject] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [visible, setVisible] = useState(false);
  const [languages, setlanguages] = useState(null);
  const [projectName, setProjectName] = useState(null);
  const [projectList, setProjectList] = useState("");
  const [loader, setloader] = useState(false);
  const [generatecopy, setGeneratecopy] = useState(null);
  const toast = useRef(null);

  const handleSubmit = () => {
    if (!!projectName) {
      axios
        .post("http://13.51.200.43:3004/project", {
          name: projectName,
        })
        .then((response) => {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Project Added",
            life: 3000,
          });
          handleprojectlist();
        })
        .catch((error) => {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Error submitting project",
            life: 3000,
          });
        })
        .finally(() => {
          setVisible(false);
        });
    } else {
      toast.current.show({
        severity: "info",
        summary: "Info",
        detail: "You need to enter Project Name",
        life: 3000,
      });
    }
  };

  const handleprojectlist = () => {
    axios
      .get("http://13.51.200.43:3004/project")
      .then((response) => {
        setProjectList(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setVisible(false);
      });
  };

  const languagesList = [{ name: "English" }];

  useEffect(() => {
    handleprojectlist();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const isValidURL = (url) => {
    const urlRegex =
      /^(https?:\/\/)?([\w-]+\.)+([a-z]{2,6}\.?)(\/[\w.-]*)*\/?$/i;
    return urlRegex.test(url);
  };

  const validation = () => {
    return (
      languages?.name?.length && project?.name?.length && inputValue?.length
    );
  };

  const handleGenerateCopy = () => {
    if (validation()) {
      if (isValidURL(inputValue)) {
        setloader(true);
        axios
          .post("http://13.51.200.43:3004/generateContent", {
            language: languages?.name,
            project_name: project?.name,
            url: inputValue,
          })
          .then((response) => {
            setGeneratecopy(response.data);
          })
          .catch((error) => {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Error getting project details",
              life: 3000,
            });
          })
          .finally(() => {
            setloader(false);
          });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Invalid Domain",
          life: 3000,
        });
      }
    } else {
      toast.current.show({
        severity: "info",
        summary: "Info",
        detail: "Enter all Fields",
        life: 3000,
      });
    }
  };

  return (
    <div className="grid p-4">
      <Toast ref={toast} />
      <div className="col-12 md:col-6">
        <div className="underline text-blue-300 mb-4 font-bold">Prompt</div>
        <div className="grid">
          <div className="col-6">
            <div className="mb-2">Language</div>
            <Dropdown
              value={languages}
              onChange={(e) => setlanguages(e.value)}
              options={languagesList}
              optionLabel="name"
              placeholder="Languages"
              className="w-full"
            />
          </div>
          <div className="col-6">
            <div className="mb-2">Project</div>
            <Dropdown
              value={project}
              onChange={(e) => setProject(e.value)}
              options={projectList}
              optionLabel="name"
              placeholder="Project"
              className="w-full"
            />
          </div>
          <div className="col-10">Create Project Here</div>
          <div
            className="text-blue-400 col-2 cursor-pointer"
            onClick={() => setVisible(true)}
          >
            My Project
          </div>
          <div className="col-12">Website/Landing page URL</div>
          <div className="col-12">
            <InputText
              value={inputValue}
              onChange={handleInputChange}
              maxLength={75}
              className="w-full"
            />
          </div>
          <div className="col-12">
            <Button
              label="Generate Copy"
              className="w-full"
              onClick={handleGenerateCopy}
            />
          </div>
        </div>
      </div>
      <div className="col-12 md:col-6">
        <div className="underline text-blue-300 mb-4 font-bold">Results</div>
        <div className="bg-gray-100 p-4 flex flex-column align-items-center justify-content-center">
          {!!generatecopy ? (
            Object.values(generatecopy)?.map((item) => (
              <div className="mb-4">
                <div className="mb-2 flex justify-content-center capitalize">
                  {item.social_media} Ad
                </div>
                {item.url ? (
                  <Card
                    title=""
                    subTitle={item.description}
                    footer={
                      <div>
                        <div className="footer" />
                        <div className="flex mt-3 justify-content-between">
                          <div>
                            <i className="pi pi-thumbs-up mr-2" />
                            Like
                          </div>
                          <div>
                            <i className="pi pi-comment mr-2" />
                            comment
                          </div>
                          <div>
                            <i className="pi pi-share-alt mr-2" />
                            share
                          </div>
                        </div>
                      </div>
                    }
                    header={
                      <div className="flex align-items-center p-2">
                        {" "}
                        <Avatar
                          icon="pi pi-user"
                          className="mr-2"
                          shape="circle"
                        />{" "}
                        <div>
                          <div className="font-bold capitalize">
                            {item.project}
                          </div>
                          <div className="text-sm">sponsored</div>
                        </div>
                      </div>
                    }
                    className="md:w-25rem"
                  >
                    <div className="flex justify-content-center">
                      <img
                        alt="Card"
                        src={item.img_url}
                        width={300}
                        height={350}
                      />
                    </div>
                    <div className="text-gray-500 mt-4">{item.url}</div>
                    <div>{item.headline}</div>
                  </Card>
                ) : (
                  <Card
                    footer={
                      <div className="flex align-items-center justify-content-between">
                        <div className="flex">
                          <div className="border-1 p-2 border-gray-300 border-round mr-2">
                            <i className="pi pi-thumbs-up" />
                          </div>
                          <div className="border-1 p-2 border-gray-300 border-round">
                            <i className="pi pi-thumbs-down" />
                          </div>
                        </div>
                        <div className="flex justify-content-between">
                          <div className="border-1 p-2 border-gray-300 border-round mr-2">
                            <i className="pi pi-share-alt mr-2" />
                            Share
                          </div>
                          <div className="border-1 p-2 border-gray-300 border-round mr-2">
                            <i className="pi pi-copy mr-2" />
                            copy
                          </div>
                          <div className="border-1 p-2 border-gray-300 border-round">
                            <i className="pi pi-download mr-2" />
                            save
                          </div>
                        </div>
                      </div>
                    }
                    header={""}
                    className="md:w-25rem"
                  >
                    <div className="text-blue-600 mb-2 font-bold">
                      {item.headline}
                    </div>
                    <div>{item.description}</div>
                  </Card>
                )}
              </div>
            ))
          ) : (
            <div
              className="bg-gray-100 flex align-items-center text-gray-400"
              style={{ height: "30vh" }}
            >
              {loader ? (
                <ProgressSpinner />
              ) : (
                <>Generate you copy to see results</>
              )}
            </div>
          )}
        </div>
      </div>
      <Dialog
        visible={visible}
        style={{ width: "400px" }}
        header="Project Name"
        modal
        onHide={() => setVisible(false)}
        footer={
          <div>
            <Button label="Submit" onClick={handleSubmit} />
          </div>
        }
      >
        {" "}
        <div className="p-field">
          <label htmlFor="projectName flex">Create New Project Name:</label>
          <InputText
            id="projectName"
            className="w-full mt-4"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default Main;
