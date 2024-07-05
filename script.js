const n = 20;
let array = [];
let speed = 50;
init();
let audioCtx = null;


function playNote(freq) {
    if (audioCtx === null) {
        audioCtx = new (AudioContext || webkitAudioContext || window.webkitAudioContext)();
    }
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.1;
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    const dur = 0.1;
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + dur);
}

function init(){
    array = [];
    for(let i = 0; i < n; i++){
        array[i] = Math.random();
    }
    showBars();
}

function play(sortFunc) {
    const copy = [...array];
    const moves = sortFunc(copy); // Get moves from sorting function
    animate(moves);
}

function animate(moves){
    if (moves.length == 0){
        showBars();
        return;
    }
    const move = moves.shift();
    const [i, j] = move.indices;

    if (move.type == "swap"){
        [array[i], array[j]] = [array[j], array[i]];
    }
    playNote(200 + array[i] * 500);
    playNote(200 + array[j] * 500);

    showBars(move);
    setTimeout(function(){
        animate(moves);
    }, 210 - speed);
}

function bubbleSort(array){
    const moves = [];
    do{
        var swapped = false;
        for (let i = 1; i < array.length; i++){
            if (array[i - 1] > array[i]){
                swapped = true;
                moves.push({indices: [i - 1, i], type: "swap"});
                [array[i - 1], array[i]] = [array[i], array[i - 1]];
            }
        }
    } while(swapped);
    return moves;
}

function insertionSort(array){
    const moves = [];
    for (let i = 1; i < array.length; i++){
        let j = i;
        while (j > 0 && array[j - 1] > array[j]){
            moves.push({indices: [j - 1, j], type: "swap"});
            [array[j - 1], array[j]] = [array[j], array[j - 1]];
            j--;
        }
    }
    return moves;
}

function selectionSort(array){
    const moves = [];
    for (let i = 0; i < array.length - 1; i++){
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++){
            if (array[j] < array[minIndex]){
                minIndex = j;
            }
        }
        if (minIndex !== i){
            moves.push({indices: [i, minIndex], type: "swap"});
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
        }
    }
    return moves;
}



// function mergeSort(array){
//     if(array.length < 2) return array;
//     const mid = Math.floor(array.length / 2);
//     const left = array.slice(0, mid);
//     const right = array.slice(mid);

//     return merge(mergeSort(left), mergeSort(right), moves);
// }
// function merge(left, right) {
//     const result = [];
//     let leftIndex = 0, rightIndex = 0;

//     while (leftIndex < left.length && rightIndex < right.length) {
//         if (left[leftIndex] < right[rightIndex]) {
//             result.push(left[leftIndex++]);
//         } else {
//             result.push(right[rightIndex++]);
//         }
//     }
//     return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
// }




// function quickSort(array, low = 0, high = array.length - 1) {
//     const moves = [];
//     if (low < high) {
//         const pi = partition(array, low, high, moves);
//         quickSort(array, low, pi - 1, moves);
//         quickSort(array, pi + 1, high, moves);
//     }
//     return moves;
// }

// function partition(array, low, high, moves) {
//     const pivot = array[high];
//     let i = low - 1;
//     for (let j = low; j < high; j++) {
//         if (array[j] < pivot) {
//             i++;
//             moves.push({ indices: [i, j], type: "swap" });
//             [array[i], array[j]] = [array[j], array[i]];
//         }
//     }
//     moves.push({ indices: [i + 1, high], type: "swap" });
//     [array[i + 1], array[high]] = [array[high], array[i + 1]];
//     return i + 1;
// }




// function heapSort(array) {
//     const moves = [];
//     buildMaxHeap(array, moves);
//     for (let i = array.length - 1; i > 0; i--) {
//         moves.push({ indices: [0, i], type: "swap" });
//         [array[0], array[i]] = [array[i], array[0]];
//         heapify(array, 0, i, moves);
//     }
//     return moves;
// }

// function buildMaxHeap(array, moves) {
//     const length = array.length;
//     for (let i = Math.floor(length / 2); i >= 0; i--) {
//         heapify(array, i, length, moves);
//     }
// }

// function heapify(array, i, max, moves) {
//     let index, leftChild, rightChild;
//     while (i < max) {
//         index = i;
//         leftChild = 2 * i + 1;
//         rightChild = leftChild + 1;
//         if (leftChild < max && array[leftChild] > array[index]) {
//             index = leftChild;
//         }
//         if (rightChild < max && array[rightChild] > array[index]) {
//             index = rightChild;
//         }
//         if (index === i) {
//             return;
//         }
//         moves.push({ indices: [i, index], type: "swap" });
//         [array[i], array[index]] = [array[index], array[i]];
//         i = index;
//     }
// }




function showBars(move){
    const container = document.getElementById('container');
    container.innerHTML = "";
    for (let i = 0; i < array.length; i++){
        const bar = document.createElement("div");
        bar.style.height = array[i] * 100 + "%";
        bar.classList.add("bar");
        if (move && move.indices.includes(i)){
            bar.style.backgroundColor = move.type == "swap" ? "red" : "blue";
        }
        container.appendChild(bar);
    }
}

document.getElementById('speed').addEventListener('input', function() {
    speed = parseInt(this.value);
});




// function generateMovesForMergeSort(original, sorted) {
//     const moves = [];
//     for (let i = 0; i < original.length; i++) {
//         for (let j = 0; j < sorted.length; j++) {
//             if (original[i] === sorted[j] && i !== j) {
//                 moves.push({ indices: [i, j], type: "swap" });
//                 [sorted[i], sorted[j]] = [sorted[j], sorted[i]]; // Swap for animation
//                 break;
//             }
//         }
//     }
//     return moves;
// }

