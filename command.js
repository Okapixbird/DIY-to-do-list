// Function to create a new list object
function create_list(list_id, list_name){
    return {
        id: list_id,
        list_name: list_name,
        Task: []
    }
}

// Function to create a new task object
function create_task(task_id, task_name){
    return {
        id: task_id,
        task_name: task_name
    }
}

// Function to generate unique IDs based on the current timestamp
function generate_random_ids(){
    return Date.now()
}

// List variables
let all_list = document.querySelector('.all-list')
let list_name_input = document.querySelector('.list-name')
let add_list = document.querySelector('.add-list')
let delete_list = document.querySelector('.delete-list')
let list_array = []  // Array to store all created lists
let highlight;        // Variable to track the currently highlighted list
let selected_list     // Variable to store the selected list

// Task variables
let title = document.querySelector('.title')
let all_task = document.querySelector('.all-task')
let task_name_input = document.querySelector('.task-name')
let add_task = document.querySelector('.add-task')
let delete_task = document.querySelector('.delete-task')
let selected_task;    // Variable to store the selected task

// Event listener for adding a new list
add_list.addEventListener('click', ()=>{
    let list_name = list_name_input.value
    if(list_name.trim() !== ''){
        // Creating random unique list id
        let list_id = generate_random_ids();

        // Create list element and append it to the DOM
        let independent_list = document.createElement('li')
        independent_list.classList.add('list')
        independent_list.textContent = list_name
        all_list.appendChild(independent_list)
        list_name_input.value = ''
        title.textContent = list_name

        // Set dataset.listId for the list element
        independent_list.dataset.listId = list_id

        // Highlight the list
        independent_list.addEventListener('click', ()=>{
            if(highlight){
                highlight.classList.remove('highlight')
            }
            independent_list.classList.add('highlight')

            // Update variables for the selected list
            highlight = independent_list
            selected_list = list_array.find((list) => list.id === list_id);
            title.textContent = selected_list.list_name

            // Display associated tasks
            displayAssociatedTask(list_id)
        })

        // Add the new list to the array
        list_array.push(create_list(list_id, list_name))
    }
})

// Function to display associated tasks for a given list
function displayAssociatedTask(list_id){
    // Find the associated list in list_array
    let selected_list = list_array.find((list) => list.id === list_id);

    // Clear existing tasks in task_container
    while(all_task.firstChild){
        all_task.removeChild(all_task.firstChild)
    }

    // Create and append the associated tasks to task_container
    selected_list.Task.forEach((task) => {
        let task_item = document.createElement('li');
        task_item.classList.add('task');
        task_item.textContent = task.task_name;

        // Event listener for selecting a task
        task_item.addEventListener('click', () => {
            // Remove 'selected' class from all tasks
            document.querySelectorAll('.task').forEach((task) => {
                task.classList.remove('selected');
            });

            // Add 'selected' class to the clicked task
            task_item.classList.add('selected');
            selected_task = task; // Update the selected_task variable
        });

        all_task.appendChild(task_item); // Append the task item to the task container
    });
}

// Event listener for adding a new task
add_task.addEventListener('click', ()=>{
    let task_name = task_name_input.value
    if (task_name.trim() !== '' && selected_list) {
        // Generate a unique task id
        let task_id = generate_random_ids();

        // Create a new task and add it to the selected list
        let new_task = create_task(task_id, task_name);
        selected_list.Task.push(new_task);
        task_name_input.value = ''; // Clear the task input field

        // Update the selected_task to the newly added task
        selected_task = new_task;

        // Display the updated associated tasks
        displayAssociatedTask(selected_list.id);
    }
})

// Event listener for deleting a list
delete_list.addEventListener('click', () => {
    if (highlight) {
        let list_id = highlight.dataset.listId;

        // Find the index of the list to be deleted
        const listIndex = list_array.findIndex((list) => list.id === parseInt(list_id));

        if (listIndex !== -1) {
            // Remove the list from the array
            list_array.splice(listIndex, 1);

            // Remove the highlighted class from the UI
            highlight.remove();

            // Clear the title and associated tasks
            title.textContent = '';
            all_task.innerHTML = '';
        }
    }
});

// Event listener for deleting a task
delete_task.addEventListener('click', () => {
    if (selected_task) {
        const task_id = selected_task.id;

        // Find the index of the task to be deleted
        const taskIndex = selected_list.Task.findIndex((task) => task.id === task_id);

        if (taskIndex !== -1) {
            // Remove the task from the selected_list.Task array
            selected_list.Task.splice(taskIndex, 1);

            // Refresh the displayed tasks
            displayAssociatedTask(selected_list.id);

            // Reset the selected_task variable
            selected_task = null;
        }
        console.log(task_id)
    }
});
