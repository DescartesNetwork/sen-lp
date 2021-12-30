import { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import CopyToClipboard from 'react-copy-to-clipboard'

import { Button, Col, Popover, Row, Space, Tooltip, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import { MintAvatar, MintSymbol } from 'app/components/mint'

import { asyncWait } from 'shared/util'
import { usePool } from 'senhub/providers'

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
    return history.push(`/app/sen_farming?mintAddress=${mint_lpt}`)
  }, [history, mint_lpt])

  return (
    <Row gutter={[16, 16]}>
      <Col flex="auto">
        <Space>
          <MintAvatar mintAddress={mint_lpt} size={32} />
          <MintSymbol mintAddress={mint_lpt} />
        </Space>
      </Col>
      <Col>
        <Space>
          <Popover
            placement="left"
            content={
              <Space>
                <Typography.Text>Pool Address: {poolAddress}</Typography.Text>
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
              </Space>
            }
          >
            <Button
              type="text"
              icon={<IonIcon name="alert-circle-outline" />}
            />
          </Popover>
          <Button onClick={goFarming}>Go Farming</Button>
        </Space>
      </Col>
    </Row>
  )
}
export default PoolDetailsHeader
