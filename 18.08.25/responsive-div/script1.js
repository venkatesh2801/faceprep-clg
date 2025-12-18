document.addEventListener('DOMContentLoaded', function() {
    const marginSlider = document.getElementById('marginRange');
    const borderSlider = document.getElementById('borderRange');
    const paddingSlider = document.getElementById('paddingRange');
    const boxExample = document.querySelector('.box-model-example');
    
    const marginValue = document.getElementById('marginValue');
    const borderValue = document.getElementById('borderValue');
    const paddingValue = document.getElementById('paddingValue');
    
    marginSlider.addEventListener('input', function() {
        const value = this.value + 'px';
        boxExample.style.margin = value;
        marginValue.textContent = value;
    });
    
    borderSlider.addEventListener('input', function() {
        const value = this.value + 'px';
        boxExample.style.borderWidth = value;
        borderValue.textContent = value;
    });
    
    paddingSlider.addEventListener('input', function() {
        const value = this.value + 'px';
        boxExample.style.padding = value;
        paddingValue.textContent = value;
    });
});