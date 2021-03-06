/**
 * printf
 *
 * @param {String} str
 * @param {String} values
 * @return {String}
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
	noItem: 'No item',
};

export const error = {
	service: 'Service error',
	id: 'Please enter only alphanumeric characters `-` and `_`.',
	noValue: `There is no value for '{0}'.`,
	confirmPassword: `확인용 비밀번호가 다릅니다.`,
	failedLogin: 'Failed login',
  noKeywords: `No {0} in {1}`,
  notFound: 'Not found page.',
};

export const msg = {
	successChangePassword: 'Success change user password.',
	failedChangePassword: 'Failed change user password.',
	questionChangePassword: '비밀번호가 변경되었으므로 로그아웃이 필요합니다. 로그아웃 하시겠습니까?',
	notLogin: 'You are not logged in.',
	failedParsingJson: 'Failed parsing json data.',
  currentPasswordGuide: '사용하고 있는 비밀번호를 입력해주세요.',
  newPasswordGuide: '새로운 비밀번호를 입력해주세요.',
  samePasswordGuide: '새로운 비밀번호와 같은 비밀번호를 입력해주세요.',
  confirmResetToken: 'Do you really want to reset the token?',
  successClearToken: 'Success clear token',
  errorClearToken: 'Error clear token',
  errorOrderFormat: `Please type in '0000-00-00' format.`,
};

export const keyword = {
  goBack: 'Go to back',
  serviceError: 'Service error',
};
