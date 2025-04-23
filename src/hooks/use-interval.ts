import { useEffect, useRef } from 'react';

/**
 * Custom hook để thực hiện một hàm theo một khoảng thời gian nhất định
 * Dựa trên ví dụ của Dan Abramov: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 * 
 * @param callback Hàm sẽ chạy theo chu kỳ
 * @param delay Thời gian delay tính bằng milliseconds, null để dừng interval
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>();

  // Lưu lại callback mới nhất
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Thiết lập interval
  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
} 