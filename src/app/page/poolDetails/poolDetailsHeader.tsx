import { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import CopyToClipboard from 'react-copy-to-clipboard'

import { Button, Col, Popover, Row, Space, Tooltip, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import { MintAvatar, MintSymbol } from 'app/components/mint'
import SwapButton from 'app/components/swapButton'

import { asyncWait } from 'shared/util'
import { usePool } from 'senhub/providers'
import configs from 'app/configs'

const {
  route: { farmRoute },
} = configs

const PoolDetailsHeader = ({ poolAddress }: { poolAddress: string }) => {
  const [copied, setCopied] = useState(false)
  const history = useHistory()
  const { pools } = usePool()
  const { mint_lpt } = pools?.[poolAddress] || {}

  const onCopy = async () => {
    setCopied(true)
    await asyncWait(1500)
    setCopied(false)
  }
  const goFarming = useCallback(() => {
    return history.push(`${farmRoute}?search=${poolAddress}`)
  }, [history, poolAddress])

  return (
    <Row gutter={[16, 16]}>
      <Col flex="auto">
        <Space>
          <MintAvatar mintAddress={mint_lpt} size={32} />
          <MintSymbol mintAddress={mint_lpt} />
          <Popover
            placement="right"
            content={
              <Space>
                <Tooltip title="Copied" visible={copied} arrowPointAtCenter>
                  <CopyToClipboard text={poolAddress}>
                    <Button
                      type="text"
                      size="small"
                      icon={<IonIcon name="copy-outline" />}
                      onClick={onCopy}
                    />
                  </CopyToClipboard>
                </Tooltip>
                <Typography.Text>PoolAddress: {poolAddress}</Typography.Text>
              </Space>
            }
          >
            <Button
              type="text"
              icon={<IonIcon name="alert-circle-outline" />}
            />
          </Popover>
        </Space>
      </Col>
      <Col>
        <SwapButton poolAddress={poolAddress} />
      </Col>
      <Col>
        <Button onClick={goFarming}>Go Farming</Button>
      </Col>
    </Row>
  )
}
export default PoolDetailsHeader
