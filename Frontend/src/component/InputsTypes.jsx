import React from 'react'

const InputsTypes = (text, formData, setFormData,type,id) => {
  return (
    <div>
							<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
								{text}
							</label>
							<div className='mt-1 relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<User className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									id={id}
									type={type}
									required
									value={formData.type}
									onChange={(e) => setFormData({ ...formData, type: e.target.value })}
									className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
									 placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm'
									placeholder='John Doe'
								/>
							</div>
						</div>
  )
}

export default InputsTypes