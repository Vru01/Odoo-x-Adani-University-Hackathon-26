import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios"; // Assuming axios is installed
import { 
  FiLogOut, FiCheckCircle, FiStar, FiLoader,
  FiMenu, FiX, FiChevronRight, FiFilter, FiMoreHorizontal
} from "react-icons/fi";
import { MdDashboard, MdLightbulb, MdWorkspaces } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi";

// Dummy API Base URL
const API_BASE = "https://jsonplaceholder.typicode.com"; 

const DashBoard = () => {
  const location = useLocation();
  const [data, setData] = useState({ "TO DO": [], "IN PROGRESS": [], "IN REVIEW": [], "DONE": [] });
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState({});

  // 1. FETCH DATA FROM BACKEND
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        // Using a dummy endpoint to simulate backend data
        const response = await axios.get(`${API_BASE}/todos?_limit=10`);
        
        // Transform backend response into our Kanban structure
        const formattedData = {
          "TO DO": response.data.slice(0, 3).map(item => ({
            id: String(item.id),
            title: item.title,
            label: "API TASK",
            theme: "bg-[#702963]"
          })),
          "IN PROGRESS": response.data.slice(3, 5).map(item => ({
            id: String(item.id),
            title: item.title,
            label: "CORE API",
            theme: "bg-[#8E3A80]"
          })),
          "IN REVIEW": [],
          "DONE": []
        };
        
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // 2. UPDATE BACKEND ON DRAG END
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    // Optimistic UI Update (Change locally first)
    const sourceCol = Array.from(data[source.droppableId]);
    const destCol = Array.from(data[destination.droppableId]);
    const [movedItem] = sourceCol.splice(source.index, 1);

    const newData = { ...data };
    if (source.droppableId === destination.droppableId) {
      sourceCol.splice(destination.index, 0, movedItem);
      newData[source.droppableId] = sourceCol;
    } else {
      destCol.splice(destination.index, 0, movedItem);
      newData[source.droppableId] = sourceCol;
      newData[destination.droppableId] = destCol;
    }

    setData(newData);

    // Backend Sync
    try {
      await axios.patch(`${API_BASE}/posts/${draggableId}`, {
        status: destination.droppableId,
        order: destination.index
      });
      console.log("Backend updated successfully");
    } catch (error) {
      console.error("Backend sync failed:", error);
      // Optional: Rollback UI if backend fails
    }
  };

  const toggleSubMenu = (name) => {
    setOpenSubMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };



  return (
    <div className="flex h-screen w-full bg-[#F3F4F6] text-[#111827] overflow-hidden font-sans antialiased">
      

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F9FAFB] h-full overflow-hidden">
        <header className="px-6 py-4 md:px-8 md:py-6 bg-white border-b border-gray-100 flex-shrink-0">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-600 md:hidden hover:bg-gray-100 rounded-lg">
                <FiMenu size={24} />
              </button>
              <div>
                <nav className="hidden sm:block text-[10px] font-black text-[#702963] uppercase tracking-widest mb-1">Production Planning</nav>
                <h1 className="text-xl md:text-2xl font-extrabold text-[#111827] tracking-tight">Sprint Board</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <button className="p-2 md:p-3 bg-white border border-gray-200 rounded-xl text-gray-400"><FiFilter /></button>
              <button className="bg-[#702963] text-white px-4 md:px-7 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold">+ Create Task</button>
            </div>
          </div>
        </header>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 animate-pulse">
            <FiLoader className="animate-spin mb-4" size={40} />
            <p className="font-black text-xs uppercase tracking-widest">Syncing with Backend...</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 md:p-6 w-full h-full overflow-hidden">
              {Object.entries(data).map(([colId, tasks]) => (
                <Droppable key={colId} droppableId={colId}>
                  {(provided, snapshot) => (
                    <div 
                      {...provided.droppableProps} 
                      ref={provided.innerRef} 
                      className={`flex flex-col h-full rounded-[1.5rem] p-3 transition-colors ${snapshot.isDraggingOver ? "bg-purple-50/50" : "bg-transparent"}`}
                    >
                      <div className="px-2 py-3 flex justify-between items-center mb-2 flex-shrink-0">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{colId}</span>
                        <span className="bg-white px-2 py-1 rounded-lg text-[10px] font-black text-[#702963] border border-gray-100">{tasks.length}</span>
                      </div>

                      <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide pr-1">
                        {tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white p-4 rounded-2xl border border-gray-100 shadow-sm transition-all ${snapshot.isDragging ? "shadow-xl border-[#702963] scale-105 z-50" : ""}`}
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div className={`w-8 h-1 rounded-full ${task.theme}`} />
                                  <FiMoreHorizontal className="text-gray-300" />
                                </div>
                                <p className="text-xs font-bold text-[#111827] leading-tight mb-4">{task.title}</p>
                                <div className="flex justify-between items-end">
                                  <span className="text-[8px] font-black text-[#702963] bg-purple-50 px-2 py-0.5 rounded border border-purple-100 uppercase tracking-tighter">
                                    {task.label}
                                  </span>
                                  <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-[8px] text-gray-400 font-black">MA</div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        )}
      </main>
    </div>
  );
};

export default DashBoard;