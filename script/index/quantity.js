
    document.addEventListener('DOMContentLoaded', function () {
        // Quantity Increment and Decrement
        document.querySelectorAll('.increment').forEach(button => {
            button.addEventListener('click', function () {
                let input = this.closest('td').querySelector('.quantity-input');
                input.value = parseInt(input.value) ;
            });
        });

        document.querySelectorAll('.decrement').forEach(button => {
            button.addEventListener('click', function () {
                let input = this.closest('td').querySelector('.quantity-input');
                if (parseInt(input.value) > 1) {
                    input.value = parseInt(input.value) ;
                }
            });
        });

        // Remove Product Row
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', function () {
                this.closest('tr').remove();
            });
        });
    });

