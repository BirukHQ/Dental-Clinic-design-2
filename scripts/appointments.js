// Appointment booking functionality
class AppointmentCalendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.bookedDates = new Set();
        this.holidays = new Set();
        
        this.initializeCalendar();
        this.generateBookedDates();
        this.generateHolidays();
        this.setupEventListeners();
    }

    initializeCalendar() {
        this.updateCalendarDisplay();
    }

    generateBookedDates() {
        // Simulate some booked dates for demonstration
        const today = new Date();
        const bookedDates = [
            new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
            new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
            new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8),
            new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12),
            new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15),
            new Date(today.getFullYear(), today.getMonth(), today.getDate() + 18),
            new Date(today.getFullYear(), today.getMonth(), today.getDate() + 22),
            new Date(today.getFullYear(), today.getMonth(), today.getDate() + 25),
        ];

        bookedDates.forEach(date => {
            this.bookedDates.add(this.formatDateKey(date));
        });
    }

    generateHolidays() {
        // Add some holidays and weekends as unavailable
        const today = new Date();
        const holidays = [
            new Date(today.getFullYear(), 11, 25), // Christmas
            new Date(today.getFullYear(), 0, 1),   // New Year
            new Date(today.getFullYear(), 6, 4),   // Independence Day
            new Date(today.getFullYear(), 10, 28), // Thanksgiving (approximate)
        ];

        holidays.forEach(date => {
            this.holidays.add(this.formatDateKey(date));
        });
    }

    formatDateKey(date) {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }

    updateCalendarDisplay() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const currentMonthElement = document.getElementById('currentMonth');
        if (currentMonthElement) {
            currentMonthElement.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        }

        this.renderCalendarGrid();
    }

    renderCalendarGrid() {
        const calendarGrid = document.getElementById('calendarGrid');
        if (!calendarGrid) return;

        calendarGrid.innerHTML = '';

        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            dayHeader.style.cssText = `
                font-weight: 600;
                color: #64748b;
                text-align: center;
                padding: 10px 0;
                font-size: 14px;
            `;
            calendarGrid.appendChild(dayHeader);
        });

        // Get first day of month and number of days
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startingDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            calendarGrid.appendChild(emptyDay);
        }

        // Add days of the month
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            const currentDayDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            const dayKey = this.formatDateKey(currentDayDate);
            
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            // Check if day is in the past
            if (currentDayDate < today.setHours(0, 0, 0, 0)) {
                dayElement.classList.add('other-month');
            }
            // Check if day is a weekend (Saturday or Sunday)
            else if (currentDayDate.getDay() === 0 || currentDayDate.getDay() === 6) {
                dayElement.classList.add('holiday');
            }
            // Check if day is a holiday
            else if (this.holidays.has(dayKey)) {
                dayElement.classList.add('holiday');
            }
            // Check if day is booked
            else if (this.bookedDates.has(dayKey)) {
                dayElement.classList.add('booked');
            }
            // Available day
            else {
                dayElement.classList.add('available');
                dayElement.addEventListener('click', () => this.selectDate(currentDayDate, dayElement));
            }

            // Highlight selected date
            if (this.selectedDate && this.formatDateKey(this.selectedDate) === dayKey) {
                dayElement.classList.add('selected');
            }

            calendarGrid.appendChild(dayElement);
        }
    }

    selectDate(date, element) {
        // Remove previous selection
        const previousSelected = document.querySelector('.calendar-day.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }

        // Select new date
        this.selectedDate = date;
        element.classList.add('selected');

        // Update any hidden form fields or display selected date
        this.updateSelectedDateDisplay();
    }

    updateSelectedDateDisplay() {
        const selectedDateInput = document.getElementById('selectedDate');
        if (selectedDateInput) {
            selectedDateInput.value = this.selectedDate.toISOString().split('T')[0];
        }

        // Show selected date in a user-friendly format
        const selectedDateDisplay = document.getElementById('selectedDateDisplay');
        if (selectedDateDisplay) {
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            selectedDateDisplay.textContent = `Selected: ${this.selectedDate.toLocaleDateString('en-US', options)}`;
        }
    }

    changeMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.updateCalendarDisplay();
    }

    setupEventListeners() {
        // Month navigation
        window.changeMonth = (direction) => {
            this.changeMonth(direction);
        };

        // Appointment form submission
        const appointmentForm = document.getElementById('appointmentForm');
        if (appointmentForm) {
            // Add hidden input for selected date
            const selectedDateInput = document.createElement('input');
            selectedDateInput.type = 'hidden';
            selectedDateInput.id = 'selectedDate';
            selectedDateInput.name = 'selectedDate';
            appointmentForm.appendChild(selectedDateInput);

            // Add selected date display
            const selectedDateDisplay = document.createElement('div');
            selectedDateDisplay.id = 'selectedDateDisplay';
            selectedDateDisplay.style.cssText = `
                margin-top: 15px;
                padding: 10px;
                background: #f0f9ff;
                border-radius: 8px;
                color: #0369a1;
                font-weight: 500;
                text-align: center;
                display: none;
            `;
            appointmentForm.insertBefore(selectedDateDisplay, appointmentForm.lastElementChild);

            appointmentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAppointmentSubmission(appointmentForm);
            });
        }
    }

    handleAppointmentSubmission(form) {
        if (!this.selectedDate) {
            alert('Please select a date for your appointment.');
            return;
        }

        const formData = new FormData(form);
        const appointmentData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            service: formData.get('service'),
            date: this.selectedDate.toISOString().split('T')[0],
            message: formData.get('message')
        };

        // Validate required fields
        if (!appointmentData.firstName || !appointmentData.lastName || 
            !appointmentData.email || !appointmentData.phone || !appointmentData.service) {
            alert('Please fill in all required fields.');
            return;
        }

        // Validate email format
        if (!this.validateEmail(appointmentData.email)) {
            alert('Please enter a valid email address.');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Show loading state
        submitBtn.textContent = 'Booking Appointment...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Add the selected date to booked dates
            const dateKey = this.formatDateKey(this.selectedDate);
            this.bookedDates.add(dateKey);
            
            // Update calendar display
            this.renderCalendarGrid();
            
            // Show success message
            this.showSuccessMessage(appointmentData);
            
            // Reset form
            form.reset();
            this.selectedDate = null;
            document.getElementById('selectedDateDisplay').style.display = 'none';
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    showSuccessMessage(appointmentData) {
        const successModal = document.createElement('div');
        successModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 40px;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        `;

        modalContent.innerHTML = `
            <div style="color: #10b981; font-size: 60px; margin-bottom: 20px;">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3 style="color: #1e293b; margin-bottom: 15px; font-size: 1.5rem;">Appointment Booked Successfully!</h3>
            <p style="color: #64748b; margin-bottom: 25px; line-height: 1.6;">
                Thank you, ${appointmentData.firstName}! Your appointment for ${appointmentData.service} 
                has been scheduled for ${this.selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}.
            </p>
            <p style="color: #64748b; margin-bottom: 30px; font-size: 14px;">
                A confirmation email will be sent to ${appointmentData.email}
            </p>
            <button onclick="this.closest('.success-modal').remove()" 
                    style="background: #2563eb; color: white; border: none; padding: 12px 30px; 
                           border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 16px;">
                Close
            </button>
        `;

        successModal.className = 'success-modal';
        successModal.appendChild(modalContent);
        document.body.appendChild(successModal);

        // Close modal when clicking outside
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.remove();
            }
        });

        // Auto close after 5 seconds
        setTimeout(() => {
            if (document.body.contains(successModal)) {
                successModal.remove();
            }
        }, 5000);
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

// Initialize appointment system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const calendar = new AppointmentCalendar();

    // Add time slot selection functionality
    const timeSlots = [
        '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
    ];

    // Create time slot selection
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        const timeSlotGroup = document.createElement('div');
        timeSlotGroup.className = 'form-group';
        timeSlotGroup.innerHTML = `
            <label for="timeSlot">Preferred Time</label>
            <select id="timeSlot" name="timeSlot" required>
                <option value="">Select a time</option>
                ${timeSlots.map(time => `<option value="${time}">${time}</option>`).join('')}
            </select>
        `;

        // Insert time slot selection before the message field
        const messageGroup = appointmentForm.querySelector('textarea').closest('.form-group');
        appointmentForm.insertBefore(timeSlotGroup, messageGroup);
    }

    // Add service descriptions
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
        const serviceDescriptions = {
            'general': 'Routine checkups, cleanings, and preventive care',
            'cosmetic': 'Teeth whitening, veneers, and smile makeovers',
            'surgery': 'Extractions, implants, and surgical procedures',
            'pediatric': 'Specialized care for children and teenagers',
            'emergency': 'Urgent dental care and pain relief',
            'orthodontics': 'Braces, aligners, and teeth straightening'
        };

        serviceSelect.addEventListener('change', function() {
            const existingDescription = document.getElementById('serviceDescription');
            if (existingDescription) {
                existingDescription.remove();
            }

            if (this.value && serviceDescriptions[this.value]) {
                const description = document.createElement('div');
                description.id = 'serviceDescription';
                description.style.cssText = `
                    margin-top: 8px;
                    padding: 10px;
                    background: #f0f9ff;
                    border-radius: 6px;
                    color: #0369a1;
                    font-size: 14px;
                    border-left: 3px solid #2563eb;
                `;
                description.textContent = serviceDescriptions[this.value];
                this.closest('.form-group').appendChild(description);
            }
        });
    }

    // Add form field animations
    const formInputs = document.querySelectorAll('.appointment-form input, .appointment-form select, .appointment-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.closest('.form-group').style.transform = 'translateY(-2px)';
            this.style.borderColor = '#2563eb';
            this.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
        });

        input.addEventListener('blur', function() {
            this.closest('.form-group').style.transform = 'translateY(0)';
            if (!this.value) {
                this.style.borderColor = '#e5e7eb';
                this.style.boxShadow = 'none';
            }
        });
    });
});

// Utility functions for appointment management
function getAvailableTimeSlots(date) {
    // This would typically fetch from a backend API
    const allSlots = [
        '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
    ];
    
    // Simulate some booked slots
    const bookedSlots = ['10:00 AM', '2:30 PM', '4:00 PM'];
    
    return allSlots.filter(slot => !bookedSlots.includes(slot));
}

function formatAppointmentDate(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppointmentCalendar, getAvailableTimeSlots, formatAppointmentDate };
}