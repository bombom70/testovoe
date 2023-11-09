export function debounce(fn, timeoutMs) {
  return function (...args) {
    let previousCall = this.lastCall
    this.lastCall = Date.now()
    if (previousCall && this.lastCall - previousCall <= timeoutMs) {
        clearTimeout(this.lastCallTimer)
    }
    this.lastCallTimer = setTimeout(() => fn(...args), timeoutMs)
  }
}