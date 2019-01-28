import React from 'react'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'
import sinon from 'sinon'

import SearchInput from './SearchInput'

Enzyme.configure({ adapter: new Adapter() })
chai.use(chaiEnzyme())

const shallow = Enzyme.shallow
const { expect } = chai 

describe('<SearchInput />', () => {
    it('renders an input with type search', () => {
        const wrapper = shallow(<SearchInput />)
        const input = wrapper.find('input')
        const type = input.prop('type')
        
        expect(input).to.have.lengthOf(1)
        expect(type).to.equal('search')
    })
    it('takes a callback and triggers it on change', () =>{
        const onChange = sinon.spy()
        const wrapper = shallow(<SearchInput onChange={onChange} />);
        const input = wrapper.find('input')

        input.simulate("change", { target: { value: "test"}})
        
        expect(onChange).to.have.property('callCount', 1)
    })
})