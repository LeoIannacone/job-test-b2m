import I from 'immutable'
import Menu from '../../../app/scripts/pages/battery/menu'

const onSelect = sinon.stub()

describe('BatteryMenu', () => {
  const elem = $R(TestUtils.renderIntoDocument(
    <Menu selectedMonth={3} months={I.List([1, 3, 5])} onSelect={onSelect} />
  ))

  it('renders months', () => {
    const months = elem.find('.batteryMenu-elem')
    expect(months).to.have.length(3)
    expect(months.at(0).html()).to.be.equal('January')
    expect(months.at(1).html()).to.be.equal('March')
    expect(months.at(2).html()).to.be.equal('May')
  })

  it('renders selected month', () => {
    const active = elem.find('.batteryMenu-elem.is-active')
    expect(active).to.have.length(1)
    expect(active.html()).to.be.equal('March')
  })

  it('calls onSelect', () => {
    elem.find('.batteryMenu-elem').at(2).click()
    expect(onSelect).to.have.been.calledWith(5)
  })
})
