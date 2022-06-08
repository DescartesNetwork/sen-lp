import { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import CopyToClipboard from 'react-copy-to-clipboard'
import { usePool, useWallet } from '@senhub/providers'

import { Button, Col, Popover, Row, Space, Tooltip, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'
import SwapButton from 'app/components/swapButton'
import PoolManagement from 'app/view/poolDetails/management'

import { asyncWait } from 'shared/util'
import configs from 'app/configs'

const {
  route: { farmRoute },
} = configs

const PoolDetailsHeader = ({ poolAddress }: { poolAddress: string }) => {
  const [copied, setCopied] = useState(false)
  const [visible, setVisible] = useState(false)
  const history = useHistory()
  const { pools } = usePool()
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { mint_lpt, owner } = pools?.[poolAddress] || {}

  const onCopy = async () => {
    setCopied(true)
    await asyncWait(1500)
    setCopied(false)
  }
  const goFarming = useCallback(() => {
    return history.push(`${farmRoute}?search=${poolAddress}`)
  }, [history, poolAddress])

  const ownerPool = walletAddress === owner

  return (
    <Row gutter={[16, 16]}>
      <Col flex="auto">
        <Space>
          <Space size={4}>
            <MintAvatar mintAddress={mint_lpt} size={32} />
            <Typography.Title level={5}>
              <MintSymbol mintAddress={mint_lpt} />
            </Typography.Title>
          </Space>
          <Popover
            placement="bottom"
            content={
              <Space align="center">
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
                <Space direction="vertical" size={4}>
                  <Typography.Text type="secondary">
                    PoolAddress
                  </Typography.Text>
                  <Typography.Text style={{ wordBreak: 'break-all' }}>
                    {poolAddress}
                  </Typography.Text>
                </Space>
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
        <Space>
          {ownerPool && (
            <Button onClick={() => setVisible(true)}>Management</Button>
          )}
          <SwapButton poolAddress={poolAddress} />
          <Button onClick={goFarming}>Go Farming</Button>
        </Space>
      </Col>
      <PoolManagement
        poolAddress={poolAddress}
        visible={visible}
        onClose={() => setVisible(false)}
      />
    </Row>
  )
}
export default PoolDetailsHeader
