import React, { useState } from 'react';

const AddDependency = () => {
    const [newDependency, setNewDependency] = useState({
      name: '',
      startDate: '',
      endDate: '',
      status: 'pending'
    })
    const [editingDependency, setEditingDependency] = useState(null)
  

    const addDependency = () => {
        if (newDependency.name.trim() !== '') {
            setDependencies([...dependencies, newDependency])
            setNewDependency({ name: '', startDate: '', endDate: '', status: 'pending' })
        }
    }

    const updateDependency = (index, field, value) => {
        const updatedDependencies = [...dependencies]
        updatedDependencies[index][field] = value
        setDependencies(updatedDependencies)
    }

    const cycleDependencyStatus = (index) => {
        const currentStatus = dependencies[index].status
        const statusOrder = ['pending', 'in progress', 'finished']
        const nextStatusIndex = (statusOrder.indexOf(currentStatus) + 1) % statusOrder.length
        updateDependency(index, 'status', statusOrder[nextStatusIndex])
    }


    return (
        <Accordion type="single" collapsible className="w-full" defaultValue="dependencies">
            <AccordionItem value="dependencies">
                <AccordionTrigger>Dependencies</AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-2">
                        <div className="flex space-x-2">
                            <Input
                                type="text"
                                placeholder="Dependency name"
                                value={newDependency.name}
                                onChange={(e) => setNewDependency({ ...newDependency, name: e.target.value })}
                                className="bg-neutral-900 border-neutral-700 text-white placeholder-neutral-400 focus:ring-neutral-500 focus:border-neutral-500 flex-grow"
                            />
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={`w-[120px] justify-start text-left font-normal ${!newDependency.startDate && "text-muted-foreground"}`}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {newDependency.startDate ? format(new Date(newDependency.startDate), "PPP") : <span>Start</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={newDependency.startDate ? new Date(newDependency.startDate) : undefined}
                                        onSelect={(date) => setNewDependency({ ...newDependency, startDate: date ? date.toISOString() : '' })}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={`w-[120px] justify-start text-left font-normal ${!newDependency.endDate && "text-muted-foreground"}`}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {newDependency.endDate ? format(new Date(newDependency.endDate), "PPP") : <span>End</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={newDependency.endDate ? new Date(newDependency.endDate) : undefined}
                                        onSelect={(date) => setNewDependency({ ...newDependency, endDate: date ? date.toISOString() : '' })}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <select
                                value={newDependency.status}
                                onChange={(e) => setNewDependency({ ...newDependency, status: e.target.value })}
                                className="bg-neutral-900 border-neutral-700 text-white focus:ring-neutral-500 focus:border-neutral-500 rounded-md"
                            >
                                {Object.keys(statusColors).map((key) => (
                                    <option key={key} value={key}>{key}</option>
                                ))}
                            </select>
                            <Button
                                type="button"
                                onClick={addDependency}
                                className="bg-neutral-800 hover:bg-neutral-700"
                            >
                                Add
                            </Button>
                        </div>
                        <AnimatePresence>
                            {dependencies.length > 0 && (
                                <motion.ul
                                    className="space-y-2 mt-2"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                    {dependencies.map((dep, index) => (
                                        <motion.li
                                            key={index}
                                            className="bg-neutral-800 rounded-lg p-3 text-sm flex justify-between items-center shadow-md hover:shadow-lg transition-all duration-300"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        >
                                            <div className="flex items-center space-x-3 flex-grow">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                                {editingDependency === index ? (
                                                    <Input
                                                        type="text"
                                                        value={dep.name}
                                                        onChange={(e) => updateDependency(index, 'name', e.target.value)}
                                                        onBlur={() => setEditingDependency(null)}
                                                        autoFocus
                                                        className="bg-neutral-700 border-neutral-600 text-white"
                                                    />
                                                ) : (
                                                    <span
                                                        onClick={() => setEditingDependency(index)}
                                                        className="cursor-pointer hover:underline"
                                                    >
                                                        {dep.name}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className="text-xs px-2 py-1"
                                                        >
                                                            {dep.startDate ? format(new Date(dep.startDate), "PP") : 'Start'}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={dep.startDate ? new Date(dep.startDate) : undefined}
                                                            onSelect={(date) => updateDependency(index, 'startDate', date ? date.toISOString() : '')}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className="text-xs px-2 py-1"
                                                        >
                                                            {dep.endDate ? format(new Date(dep.endDate), "PP") : 'End'}
                                                        </Button>
                                                    </PopoverTrigger>

                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={dep.endDate ? new Date(dep.endDate) : undefined}
                                                            onSelect={(date) => updateDependency(index, 'endDate', date ? date.toISOString() : '')}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <motion.button
                                                    onClick={() => cycleDependencyStatus(index)}
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[dep.status]} text-white`}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    {dep.status}
                                                </motion.button>
                                                <Button
                                                    type="button"
                                                    onClick={() => setDependencies(dependencies.filter((_, i) => i !== index))}
                                                    className="bg-red-600 hover:bg-red-700 h-6 w-6 p-0"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default AddDependency;