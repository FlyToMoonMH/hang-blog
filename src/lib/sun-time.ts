import { getTimes } from "suncalc";

/**
 * 根据浏览器时区估算经纬度（不需要用户授权地理位置）
 * - 经度：由时区偏移计算，每差1小时 = 15度
 * - 纬度：默认 35°N（覆盖中国大部分地区）
 */
function getEstimatedLocation(): { lat: number; lon: number } {
  const offsetMinutes = new Date().getTimezoneOffset();
  // getTimezoneOffset 返回 UTC - 本地时间（分钟），东八区返回 -480
  const offsetHours = -offsetMinutes / 60;
  const lon = offsetHours * 15; // 东经为正，西经为负
  const lat = 35; // 默认北纬35度（中国中部纬度）
  return { lat, lon };
}

/**
 * 判断当前时间是否为白天（日出之后、日落之前）
 * 使用 suncalc 根据估算的地理位置计算精确的日出日落时间
 */
function isDaytime(): boolean {
  const { lat, lon } = getEstimatedLocation();
  const now = new Date();
  const times = getTimes(now, lat, lon);

  const sunrise = times.sunrise; // 日出时间（太阳上边缘接触地平线）
  const sunset = times.sunset; // 日落时间

  // 如果日出或日落无效（极昼/极夜），用 6:00 / 18:00 兜底
  const sunriseValid = sunrise && !isNaN(sunrise.getTime()) ? sunrise : null;
  const sunsetValid = sunset && !isNaN(sunset.getTime()) ? sunset : null;

  if (!sunriseValid || !sunsetValid) {
    const h = now.getHours();
    return h >= 6 && h < 18;
  }

  return now >= sunriseValid && now < sunsetValid;
}

/**
 * 根据日出日落时间解析 auto 模式的实际主题
 */
export function resolveAutoTheme(): "light" | "dark" {
  return isDaytime() ? "light" : "dark";
}

/**
 * 获取下一次主题切换的时间（日出或日落，取最近的一个）
 * 用于设置定时器，在日出/日落时刻精确切换
 */
export function getNextSwitchTime(): Date | null {
  const { lat, lon } = getEstimatedLocation();
  const now = new Date();
  const times = getTimes(now, lat, lon);

  const sunrise = times.sunrise;
  const sunset = times.sunset;

  // 找到下一个未来的切换点
  const candidates: Date[] = [];

  if (sunrise && !isNaN(sunrise.getTime())) {
    if (sunrise > now) candidates.push(sunrise);
  }
  if (sunset && !isNaN(sunset.getTime())) {
    if (sunset > now) candidates.push(sunset);
  }

  // 如果今天的日出日落都过了，取明天的日出
  if (candidates.length === 0) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTimes = getTimes(tomorrow, lat, lon);
    if (tomorrowTimes.sunrise && !isNaN(tomorrowTimes.sunrise.getTime())) {
      candidates.push(tomorrowTimes.sunrise);
    }
  }

  if (candidates.length === 0) return null;

  // 取最近的一个
  candidates.sort((a, b) => a.getTime() - b.getTime());
  return candidates[0];
}
