import React, { useState, useRef } from "react";
import { Container, Tabs, TabList, TabPanels, Tab, TabPanel, Table, Thead, Tbody, Tr, Th, Td, Input, IconButton, Select, HStack, VStack, Box, Button } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash, FaMicrophone, FaStop } from "react-icons/fa";

const initialTasks = [
  { taskName: "Task 1", dueDate: "2023-10-01", priority: "High", status: "Pending", assignedTo: "John Doe" },
  { taskName: "Task 2", dueDate: "2023-10-05", priority: "Medium", status: "Completed", assignedTo: "Jane Smith" },
];

const initialProjects = [
  { projectName: "Project 1", startDate: "2023-09-01", endDate: "2023-12-01", status: "Ongoing", owner: "Alice Johnson" },
  { projectName: "Project 2", startDate: "2023-10-01", endDate: "2024-01-01", status: "Planned", owner: "Bob Brown" },
];

const Index = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [projects, setProjects] = useState(initialProjects);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editingProjectIndex, setEditingProjectIndex] = useState(null);

  const handleAddTask = () => {
    setTasks([...tasks, { taskName: "", dueDate: "", priority: "", status: "", assignedTo: "" }]);
  };

  const handleAddProject = () => {
    setProjects([...projects, { projectName: "", startDate: "", endDate: "", status: "", owner: "" }]);
  };

  const handleTaskChange = (index, field, value) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...projects];
    newProjects[index][field] = value;
    setProjects(newProjects);
  };

  const handleDeleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const handleDeleteProject = (index) => {
    const newProjects = projects.filter((_, i) => i !== index);
    setProjects(newProjects);
  };

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleStartRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = audioUrl;
      a.download = "recording.wav";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(audioUrl);
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  return (
    <Container maxW="container.xl" py={4}>
      <HStack spacing={4} mb={4}>
        <Button onClick={isRecording ? handleStopRecording : handleStartRecording} leftIcon={isRecording ? <FaStop /> : <FaMicrophone />}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
      </HStack>
      <Tabs>
        <TabList>
          <Tab>Tasks</Tab>
          <Tab>Projects</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Task Name</Th>
                  <Th>Due Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {tasks.map((task, index) => (
                  <Tr key={index}>
                    <Td>
                      <Input value={task.taskName} onChange={(e) => handleTaskChange(index, "taskName", e.target.value)} />
                    </Td>
                    <Td>
                      <Input type="date" value={task.dueDate} onChange={(e) => handleTaskChange(index, "dueDate", e.target.value)} />
                    </Td>
                    <Td>
                      <IconButton aria-label="Delete" icon={<FaTrash />} onClick={() => handleDeleteTask(index)} />
                    </Td>
                  </Tr>
                ))}
                <Tr>
                  <Td colSpan={6} textAlign="center">
                    <IconButton aria-label="Add Task" icon={<FaPlus />} onClick={handleAddTask} />
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TabPanel>

          <TabPanel>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Project Name</Th>
                  <Th>Start Date</Th>
                  <Th>End Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {projects.map((project, index) => (
                  <Tr key={index}>
                    <Td>
                      <Input value={project.projectName} onChange={(e) => handleProjectChange(index, "projectName", e.target.value)} />
                    </Td>
                    <Td>
                      <Input type="date" value={project.startDate} onChange={(e) => handleProjectChange(index, "startDate", e.target.value)} />
                    </Td>
                    <Td>
                      <Input type="date" value={project.endDate} onChange={(e) => handleProjectChange(index, "endDate", e.target.value)} />
                    </Td>
                    <Td>
                      <IconButton aria-label="Delete" icon={<FaTrash />} onClick={() => handleDeleteProject(index)} />
                    </Td>
                  </Tr>
                ))}
                <Tr>
                  <Td colSpan={6} textAlign="center">
                    <IconButton aria-label="Add Project" icon={<FaPlus />} onClick={handleAddProject} />
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default Index;
