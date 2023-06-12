/**
 * with commas
 * 3자리 단위로 콤마 표시하도록 변환하기
 */
export function withCommas(n)
{
  return n ? n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'
}
