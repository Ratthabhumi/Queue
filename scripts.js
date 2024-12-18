document.getElementById('queueForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้าเว็บ

    const name = document.getElementById('name').value.trim(); // ดึงค่าจาก input และตัดช่องว่างด้านหน้าและด้านหลัง

    // ตรวจสอบความถูกต้องของข้อมูลฟอร์ม
    if (!name) {
        toastr.error('Name is required!', 'Error');
        return;
    }

    try {
        const queueItem = await addQueueItem(name); // เพิ่มคิวไปยังฐานข้อมูล
        displayQueueItem(queueItem); // แสดงคิวในหน้าเว็บ
        toastr.success('Added to queue!', 'Success'); // การแจ้งเตือนเมื่อเพิ่มคิวสำเร็จ
    } catch (error) {
        toastr.error('Failed to add to queue', 'Error'); // การแจ้งเตือนเมื่อการเพิ่มคิวไม่สำเร็จ
    }

    document.getElementById('name').value = ''; // รีเซ็ตค่าใน input
});

// ฟังก์ชันสำหรับเพิ่มคิวไปยังฐานข้อมูล
async function addQueueItem(name) {
    const response = await fetch('http://localhost:3000/queue', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name })
    });
    if (!response.ok) {
        throw new Error('Failed to add to queue');
    }
    return await response.json();
}

// ฟังก์ชันสำหรับดึงและแสดงรายการคิวจากฐานข้อมูล
async function loadQueueItems() {
    const response = await fetch('http://localhost:3000/queue');
    const queueItems = await response.json();
    document.getElementById('queueItems').innerHTML = ''; // ล้างรายการคิวเดิม
    queueItems.forEach(displayQueueItem); // แสดงรายการคิวที่ดึงมาใหม่
}

// ฟังก์ชันสำหรับแสดงรายการคิวในหน้าเว็บ
function displayQueueItem(queueItem) {
    const queueItemElement = document.createElement('li');
    queueItemElement.textContent = queueItem.name;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', async function() {
        try {
            await deleteQueueItem(queueItem._id);
            queueItemElement.remove();
            toastr.success('Removed from queue!', 'Success'); // การแจ้งเตือนเมื่อการลบคิวสำเร็จ
        } catch (error) {
            toastr.error('Failed to remove item', 'Error'); // การแจ้งเตือนเมื่อการลบคิวไม่สำเร็จ
        }
    });

    queueItemElement.appendChild(deleteBtn);
    document.getElementById('queueItems').appendChild(queueItemElement);
}

// ฟังก์ชันสำหรับลบคิวจากฐานข้อมูล
async function deleteQueueItem(id) {
    const response = await fetch(`http://localhost:3000/queue/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to delete item');
    }
}

// ฟังก์ชันสำหรับการค้นหา
document.getElementById('searchInput').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    const queueItems = document.querySelectorAll('#queueItems li');
    queueItems.forEach(function(item) {
        const itemName = item.textContent.toLowerCase();
        if (itemName.includes(searchValue)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
});

// ดึงรายการคิวเมื่อโหลดหน้าเว็บ
loadQueueItems();
