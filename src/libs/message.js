/**
 * printf
 * @param {string} str
 * @param {string} values
 * @return {string}
 */
export function printf(str, ...values)
{
  for (let i = 0; i < values.length; i++)
  {
    let pattern = `\\{${i}\\}`;
    let replace = new RegExp(pattern, 'g');
    str = str.replace(replace, values[i]);
  }
  return str;
}

export const service = {
  //
};

export const error = {
  samePassword: '확인용 비밀번호가 다릅니다.',
};

export const words = {
  warningDeleteItem: '이 {0}을(를) 삭제하면 복구할 수 없습니다.',
  guideCurrentPassword: '사용하고 있는 비밀번호를 입력해주세요.',
  guideNewPassword: '새로운 비밀번호를 입력해주세요.',
  guideVerifyPassword: '새로운 비밀번호와 같은 비밀번호를 입력해주세요.',
  guideSamePassword: '현재 비밀번호와 새로운 비밀번호가 같습니다.',
  confirmDeleteItem: '이 {0}을(를) 삭제할까요?',
  confirmLogout: '정말 로그아웃 할까요?',
  successChangePassword: '비밀번호가 변경되었습니다.',
};
