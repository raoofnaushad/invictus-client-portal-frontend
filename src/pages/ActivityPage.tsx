import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Filter, 
  Plus, 
  ChevronDown,
  ChevronRight,
  Grid,
  List,
  Calendar,
  User,
  FileText,
  Edit2,
  Trash2
} from "lucide-react";
import { ActivityApiService } from "@/services/activityApi";
import { Task, Request, TaskStatus, RequestStatus } from "@/types/activity";

const ActivityPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [kanbanTasks, setKanbanTasks] = useState<Record<string, Task[]>>({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [activeTab, setActiveTab] = useState('task');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  
  // Modal states
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [createRequestOpen, setCreateRequestOpen] = useState(false);
  
  // Form states
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'New',
    priority: 'Medium',
    assignee: '',
    dueDate: ''
  });
  
  const [newRequest, setNewRequest] = useState<Partial<Request>>({
    title: '',
    description: '',
    status: 'Sent',
    priority: 'Medium',
    assignee: '',
    dueDate: '',
    category: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksData, requestsData, kanbanData] = await Promise.all([
        ActivityApiService.getTasks(),
        ActivityApiService.getRequests(),
        ActivityApiService.getKanbanTasks()
      ]);
      
      setTasks(tasksData);
      setRequests(requestsData);
      setKanbanTasks(kanbanData);
    } catch (error) {
      console.error('Error loading activity data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: TaskStatus | RequestStatus) => {
    const statusColors: Record<string, string> = {
      'New': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-green-100 text-green-800',
      'Done': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-gray-100 text-gray-800',
      'On Hold': 'bg-purple-100 text-purple-800',
      'Todo': 'bg-orange-100 text-orange-800',
      'Overdue': 'bg-red-100 text-red-800',
      'Sent': 'bg-blue-100 text-blue-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Received': 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityColors: Record<string, string> = {
      'High': 'bg-red-100 text-red-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={priorityColors[priority] || 'bg-gray-100 text-gray-800'}>
        {priority}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handleCreateTask = async () => {
    try {
      await ActivityApiService.createTask(newTask);
      setCreateTaskOpen(false);
      setNewTask({
        title: '',
        description: '',
        status: 'New',
        priority: 'Medium',
        assignee: '',
        dueDate: ''
      });
      loadData();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleCreateRequest = async () => {
    try {
      await ActivityApiService.createRequest(newRequest);
      setCreateRequestOpen(false);
      setNewRequest({
        title: '',
        description: '',
        status: 'Sent',
        priority: 'Medium',
        assignee: '',
        dueDate: '',
        category: ''
      });
      loadData();
    } catch (error) {
      console.error('Error creating request:', error);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await ActivityApiService.updateTaskStatus(taskId, newStatus);
      loadData();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const toggleRowExpansion = (itemId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(itemId)) {
      newExpandedRows.delete(itemId);
    } else {
      newExpandedRows.add(itemId);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      if (activeTab === 'task') {
        await ActivityApiService.deleteTask(itemId);
      } else {
        await ActivityApiService.deleteRequest(itemId);
      }
      loadData();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEditItem = (item: Task | Request) => {
    if (activeTab === 'task' && 'relatedTo' in item) {
      // This is a Task
      setNewTask(item as Task);
      setCreateTaskOpen(true);
    } else if (activeTab === 'request' && 'category' in item) {
      // This is a Request
      setNewRequest(item as Request);
      setCreateRequestOpen(true);
    }
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', (e.currentTarget as HTMLElement).outerHTML);
    (e.currentTarget as HTMLElement).style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = '1';
    setDraggedTask(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    
    if (draggedTask && draggedTask.status !== newStatus) {
      try {
        // Update the task status via API
        await ActivityApiService.updateTaskStatus(draggedTask.id, newStatus as TaskStatus);
        
        // Update local state optimistically instead of reloading all data
        const updatedTask = { ...draggedTask, status: newStatus as TaskStatus };
        
        // Update tasks array for table view
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === draggedTask.id ? updatedTask : task
          )
        );
        
        // Update kanban tasks
        setKanbanTasks(prevKanban => {
          const newKanban = { ...prevKanban };
          
          // Remove from old column
          if (newKanban[draggedTask.status]) {
            newKanban[draggedTask.status] = newKanban[draggedTask.status].filter(
              task => task.id !== draggedTask.id
            );
          }
          
          // Add to new column
          if (!newKanban[newStatus]) {
            newKanban[newStatus] = [];
          }
          newKanban[newStatus] = [...newKanban[newStatus], updatedTask];
          
          return newKanban;
        });
        
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    }
    
    setDraggedTask(null);
  };

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="text-left py-3 px-4 font-medium text-gray-500">Tasks</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Priority</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Assignee</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Due Date</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(activeTab === 'task' ? tasks : requests).map((item, index) => (
            <>
              <tr key={item.id} className={`border-b hover:bg-gray-50 ${index % 2 === 1 ? 'bg-gray-25' : 'bg-white'}`}>
                <td className="py-3 px-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-1 h-12 rounded ${
                      item.status === 'Todo' || item.status === 'New' ? 'bg-green-500' :
                      item.status === 'In Progress' ? 'bg-blue-500' :
                      item.status === 'Done' || item.status === 'Completed' ? 'bg-green-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0"
                          onClick={() => toggleRowExpansion(item.id)}
                        >
                          {expandedRows.has(item.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                        <FileText className="h-4 w-4" />
                        <span className="font-medium text-sm">{item.title}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {getStatusBadge(item.status)}
                </td>
                <td className="py-3 px-4">
                  {getPriorityBadge(item.priority)}
                </td>
                <td className="py-3 px-4 text-sm">
                  {item.assignee}
                </td>
                <td className="py-3 px-4 text-sm">
                  {formatDate(item.dueDate)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleEditItem(item)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost" 
                      size="sm"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </td>
              </tr>
              
              {/* Expanded row content */}
              {expandedRows.has(item.id) && (
                <tr key={`${item.id}-expanded`} className="border-b bg-gray-50">
                  <td colSpan={6} className="py-4 px-4">
                    <div className="ml-12 space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        {'relatedTo' in item && item.relatedTo && (
                          <div>
                            <h4 className="font-medium mb-2">Related to</h4>
                            <p className="text-sm text-gray-600">{item.relatedTo}</p>
                          </div>
                        )}
                        
                        <div>
                          <h4 className="font-medium mb-2">Status</h4>
                          <Select 
                            value={item.status} 
                            onValueChange={(value) => handleStatusChange(item.id, value as any)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {activeTab === 'task' ? (
                                <>
                                  <SelectItem value="New">New</SelectItem>
                                  <SelectItem value="Todo">Todo</SelectItem>
                                  <SelectItem value="In Progress">In Progress</SelectItem>
                                  <SelectItem value="Done">Done</SelectItem>
                                  <SelectItem value="Completed">Completed</SelectItem>
                                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                                  <SelectItem value="On Hold">On Hold</SelectItem>
                                  <SelectItem value="Overdue">Overdue</SelectItem>
                                </>
                              ) : (
                                <>
                                  <SelectItem value="Sent">Sent</SelectItem>
                                  <SelectItem value="In Progress">In Progress</SelectItem>
                                  <SelectItem value="Rejected">Rejected</SelectItem>
                                  <SelectItem value="Completed">Completed</SelectItem>
                                  <SelectItem value="Received">Received</SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderKanbanView = () => {
    const columns = ['New', 'In Progress', 'Completed', 'Cancelled', 'On Hold'];
    
    return (
      <div className="grid grid-cols-5 gap-4 h-full">
        {columns.map((column) => (
          <div 
            key={column} 
            className="bg-gray-50 rounded-lg p-4 min-h-[400px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-sm">{column}</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {kanbanTasks[column]?.length || 0}
                </Badge>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              {kanbanTasks[column]?.map((task) => (
                <Card 
                  key={task.id} 
                  className="p-3 bg-white shadow-sm group relative cursor-move hover:shadow-md transition-shadow"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  onDragEnd={handleDragEnd}
                >
                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleEditItem(task)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteItem(task.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3 pr-8">
                    <h4 className="font-medium text-sm text-gray-900">{task.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
                    
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500 font-medium">Assignees:</span>
                      {task.assignee.split(' ').map((name, i) => (
                        <Badge key={i} className="text-xs bg-black text-white hover:bg-gray-800">
                          {name}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(task.dueDate).split(',')[0]}</span>
                      </div>
                      {getPriorityBadge(task.priority)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Todo</h1>
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-transparent p-0">
                  <TabsTrigger value="task" className="border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:text-black bg-transparent">
                    Task
                  </TabsTrigger>
                  <TabsTrigger value="request" className="border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:text-black bg-transparent">
                    Request
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800">
                    ● Received
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800">
                    ● Sent
                  </Badge>
                </div>
                
                <Select defaultValue="all-tasks">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-tasks">All Tasks</SelectItem>
                    <SelectItem value="my-tasks">My Tasks</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="group-by">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="group-by">Group By</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border border-gray-200 rounded-lg">
                  <Button
                    variant={viewMode === "kanban" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("kanban")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>

                <Dialog open={activeTab === 'task' ? createTaskOpen : createRequestOpen} onOpenChange={activeTab === 'task' ? setCreateTaskOpen : setCreateRequestOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-black text-white hover:bg-gray-800">
                      {activeTab === 'task' ? 'Create Task' : 'Create Request'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {activeTab === 'task' ? 'Create Task' : 'Create Request'}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">
                          {activeTab === 'task' ? 'Task Name' : 'Request Name'}*
                        </Label>
                        <Input
                          id="title"
                          placeholder={`Enter ${activeTab === 'task' ? 'Task' : 'Request'} Name`}
                          value={activeTab === 'task' ? newTask.title : newRequest.title}
                          onChange={(e) => {
                            if (activeTab === 'task') {
                              setNewTask(prev => ({ ...prev, title: e.target.value }));
                            } else {
                              setNewRequest(prev => ({ ...prev, title: e.target.value }));
                            }
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        {activeTab === 'request' && (
                          <div>
                            <Label>Category</Label>
                            <Select onValueChange={(value) => setNewRequest(prev => ({ ...prev, category: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="capital-call">Capital Call</SelectItem>
                                <SelectItem value="documentation">Documentation</SelectItem>
                                <SelectItem value="asset-transfer">Asset Transfer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        
                        <div>
                          <Label>Due Date</Label>
                          <Input 
                            type="date" 
                            onChange={(e) => {
                              if (activeTab === 'task') {
                                setNewTask(prev => ({ ...prev, dueDate: e.target.value }));
                              } else {
                                setNewRequest(prev => ({ ...prev, dueDate: e.target.value }));
                              }
                            }}
                          />
                        </div>
                        
                        <div>
                          <Label>Priority</Label>
                          <Select onValueChange={(value: any) => {
                            if (activeTab === 'task') {
                              setNewTask(prev => ({ ...prev, priority: value }));
                            } else {
                              setNewRequest(prev => ({ ...prev, priority: value }));
                            }
                          }}>
                            <SelectTrigger>
                              <SelectValue placeholder="Normal" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>Assigned To</Label>
                          <Select onValueChange={(value) => {
                            if (activeTab === 'task') {
                              setNewTask(prev => ({ ...prev, assignee: value }));
                            } else {
                              setNewRequest(prev => ({ ...prev, assignee: value }));
                            }
                          }}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Muhammad Saqib">Muhammad Saqib</SelectItem>
                              <SelectItem value="James Anderson">James Anderson</SelectItem>
                              <SelectItem value="Michael Carter">Michael Carter</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Textarea
                          placeholder="Please enter your Description"
                          rows={4}
                          value={activeTab === 'task' ? newTask.description : newRequest.description}
                          onChange={(e) => {
                            if (activeTab === 'task') {
                              setNewTask(prev => ({ ...prev, description: e.target.value }));
                            } else {
                              setNewRequest(prev => ({ ...prev, description: e.target.value }));
                            }
                          }}
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => {
                          if (activeTab === 'task') {
                            setCreateTaskOpen(false);
                          } else {
                            setCreateRequestOpen(false);
                          }
                        }}>
                          Cancel
                        </Button>
                        <Button 
                          className="bg-black text-white"
                          onClick={activeTab === 'task' ? handleCreateTask : handleCreateRequest}
                        >
                          {activeTab === 'task' ? 'Create Task' : 'Create Request'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : viewMode === 'table' ? (
              renderTableView()
            ) : (
              renderKanbanView()
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivityPage;